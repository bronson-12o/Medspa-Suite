import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.campaign.findMany({
      include: {
        _count: {
          select: {
            leads: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    name: string;
    platform?: string;
    monthlySpendCents?: number;
  }) {
    return this.prisma.campaign.create({
      data,
    });
  }

  async update(id: string, data: {
    name?: string;
    platform?: string;
    monthlySpendCents?: number;
  }) {
    return this.prisma.campaign.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.campaign.delete({
      where: { id },
    });
  }
}
