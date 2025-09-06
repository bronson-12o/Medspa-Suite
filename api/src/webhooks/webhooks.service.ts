import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { LeadsService } from '../leads/leads.service';
import { CreateLeadDto } from '../leads/dto/lead.dto';

@Injectable()
export class WebhooksService {
  constructor(
    private prisma: PrismaService,
    private leadsService: LeadsService,
  ) {}

  async handleGhlLead(webhookData: any) {
    // Extract safe, non-PHI data from GHL webhook
    const leadData: CreateLeadDto = {
      externalId: webhookData.contactId || webhookData.id,
      firstName: this.sanitizeName(webhookData.firstName || webhookData.name),
      email: webhookData.email,
      phone: webhookData.phone,
      source: webhookData.source || 'ghl',
    };

    // Handle tags if provided (only procedure-related tags)
    let tagIds: string[] = [];
    if (webhookData.tags && Array.isArray(webhookData.tags)) {
      const procedureTags = webhookData.tags.filter((tag: any) => 
        this.isProcedureTag(tag.name || tag)
      );
      
      if (procedureTags.length > 0) {
        // Find or create tags
        for (const tagName of procedureTags) {
          const tag = await this.findOrCreateTag(tagName.name || tagName);
          tagIds.push(tag.id);
        }
      }
    }

    if (tagIds.length > 0) {
      leadData.tags = tagIds;
    }

    // Check if lead already exists
    const existingLead = await this.prisma.lead.findFirst({
      where: {
        OR: [
          { externalId: leadData.externalId },
          { email: leadData.email },
          { phone: leadData.phone },
        ],
      },
    });

    if (existingLead) {
      // Update existing lead with new data
      return this.prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          ...leadData,
          tags: {
            deleteMany: {},
            create: tagIds.map(tagId => ({ tagId })),
          },
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    } else {
      // Create new lead
      return this.leadsService.create(leadData);
    }
  }

  private sanitizeName(name: string): string {
    if (!name) return '';
    
    // Only keep first name or initials, remove any medical context
    const words = name.trim().split(' ');
    return words[0] || '';
  }

  private isProcedureTag(tagName: string): boolean {
    const procedureKeywords = [
      'botox', 'filler', 'surgery', 'laser', 'rhino', 'rhinoplasty',
      'btx', 'dermal', 'lip', 'cheek', 'chin', 'nose', 'breast',
      'tummy', 'lipo', 'facelift', 'brow', 'eye', 'neck'
    ];
    
    const lowerTag = tagName.toLowerCase();
    return procedureKeywords.some(keyword => lowerTag.includes(keyword));
  }

  private async findOrCreateTag(tagName: string) {
    const existingTag = await this.prisma.tag.findFirst({
      where: { name: tagName },
    });

    if (existingTag) {
      return existingTag;
    }

    return this.prisma.tag.create({
      data: {
        name: tagName,
        color: this.getTagColor(tagName),
      },
    });
  }

  private getTagColor(tagName: string): string {
    const colorMap: { [key: string]: string } = {
      'botox': '#FF6B6B',
      'filler': '#4ECDC4',
      'surgery': '#45B7D1',
      'laser': '#96CEB4',
      'rhino': '#FFEAA7',
    };

    const lowerTag = tagName.toLowerCase();
    for (const [keyword, color] of Object.entries(colorMap)) {
      if (lowerTag.includes(keyword)) {
        return color;
      }
    }

    return '#DDA0DD'; // Default color
  }
}
