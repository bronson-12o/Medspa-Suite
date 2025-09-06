import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findByLeadId(leadId: string) {
    return this.prisma.activity.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    leadId: string;
    type: string;
    payloadJson?: any;
  }) {
    return this.prisma.activity.create({
      data,
    });
  }
}
