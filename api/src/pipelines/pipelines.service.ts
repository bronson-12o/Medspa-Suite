import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PipelinesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pipelineStage.findMany({
      orderBy: { order: 'asc' },
      include: {
        currentLeads: {
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
    });
  }

  async getStagesWithCounts(pipelineId: string) {
    // For now, return all stages (assuming single pipeline)
    const stages = await this.prisma.pipelineStage.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            currentLeads: true,
          },
        },
      },
    });

    return stages.map(stage => ({
      ...stage,
      leadCount: stage._count.currentLeads,
    }));
  }

  async reorderStages(pipelineId: string, stageIds: string[]) {
    // Update the order of stages based on the provided stageIds array
    const updatePromises = stageIds.map((stageId, index) =>
      this.prisma.pipelineStage.update({
        where: { id: stageId },
        data: { order: index + 1 },
      })
    );

    await Promise.all(updatePromises);

    return this.getStagesWithCounts(pipelineId);
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
