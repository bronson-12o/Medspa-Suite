import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class OpportunitiesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    leadId: string;
    expectedValueCents: number;
    procedureCode?: string;
    expectedDate?: Date;
  }) {
    return this.prisma.opportunity.create({
      data,
      include: {
        lead: true,
      },
    });
  }

  async update(id: string, data: {
    expectedValueCents?: number;
    procedureCode?: string;
    expectedDate?: Date;
  }) {
    return this.prisma.opportunity.update({
      where: { id },
      data,
      include: {
        lead: true,
      },
    });
  }

  async findByLeadId(leadId: string) {
    return this.prisma.opportunity.findUnique({
      where: { leadId },
      include: {
        lead: true,
      },
    });
  }
}
