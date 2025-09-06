import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PipelinesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pipelineStage.findMany({
      orderBy: { order: 'asc' },
      include: {
        leads: {
          include: {
            lead: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
                opportunity: true,
              },
            },
          },
          orderBy: {
            changedAt: 'desc',
          },
        },
      },
    });
  }

  async create(data: { name: string; order: number; color?: string }) {
    return this.prisma.pipelineStage.create({
      data,
    });
  }

  async update(id: string, data: { name?: string; order?: number; color?: string }) {
    return this.prisma.pipelineStage.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.pipelineStage.delete({
      where: { id },
    });
  }
}
