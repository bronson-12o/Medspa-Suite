import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateLeadDto, UpdateLeadStageDto, UpdateLeadTagsDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    search?: string;
    stageId?: string;
    tagIds?: string[];
    campaignId?: string;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.stageId) {
      where.stages = {
        some: {
          stageId: filters.stageId,
        },
      };
    }

    if (filters?.tagIds?.length) {
      where.tags = {
        some: {
          tagId: { in: filters.tagIds },
        },
      };
    }

    if (filters?.campaignId) {
      where.campaignId = filters.campaignId;
    }

    return this.prisma.lead.findMany({
      where,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        stages: {
          include: {
            stage: true,
          },
          orderBy: {
            changedAt: 'desc',
          },
          take: 1,
        },
        opportunity: true,
        campaign: true,
        _count: {
          select: {
            activities: true,
            kpiEvents: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        stages: {
          include: {
            stage: true,
          },
          orderBy: {
            changedAt: 'desc',
          },
        },
        activities: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        opportunity: true,
        campaign: true,
        kpiEvents: {
          orderBy: {
            occurredAt: 'desc',
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async create(createLeadDto: CreateLeadDto) {
    const { tags, ...leadData } = createLeadDto;

    const lead = await this.prisma.lead.create({
      data: {
        ...leadData,
        tags: tags ? {
          create: tags.map(tagId => ({
            tagId,
          })),
        } : undefined,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        campaign: true,
      },
    });

    // Set initial stage to "New" if not specified
    const newStage = await this.prisma.pipelineStage.findFirst({
      where: { name: 'New' },
    });

    if (newStage) {
      await this.prisma.leadStage.create({
        data: {
          leadId: lead.id,
          stageId: newStage.id,
        },
      });
    }

    return lead;
  }

  async updateStage(id: string, updateStageDto: UpdateLeadStageDto) {
    const lead = await this.findOne(id);

    if (!updateStageDto.stageId) {
      throw new Error('Stage ID is required');
    }

    // Create new stage entry
    await this.prisma.leadStage.create({
      data: {
        leadId: id,
        stageId: updateStageDto.stageId,
      },
    });

    // Create activity record
    await this.prisma.activity.create({
      data: {
        leadId: id,
        type: 'stage_change',
        payloadJson: {
          fromStage: lead.stages[0]?.stage?.name,
          toStage: updateStageDto.stageId,
        },
      },
    });

    return this.findOne(id);
  }

  async updateTags(id: string, updateTagsDto: UpdateLeadTagsDto) {
    const tagIds = updateTagsDto.tagIds ?? [];

    // Remove existing tags
    await this.prisma.leadTag.deleteMany({
      where: { leadId: id },
    });

    // Add new tags
    if (tagIds.length > 0) {
      await this.prisma.leadTag.createMany({
        data: tagIds.map(tagId => ({
          leadId: id,
          tagId,
        })),
      });
    }

    // Create activity record
    await this.prisma.activity.create({
      data: {
        leadId: id,
        type: 'tag_updated',
        payloadJson: {
          tagIds,
        },
      },
    });

    return this.findOne(id);
  }

  async delete(id: string) {
    const lead = await this.findOne(id);
    
    await this.prisma.lead.delete({
      where: { id },
    });

    return { message: 'Lead deleted successfully' };
  }
}
