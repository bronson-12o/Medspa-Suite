import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(data: { name: string; color?: string }) {
    return this.prisma.tag.create({
      data,
    });
  }

  async update(id: string, data: { name?: string; color?: string }) {
    return this.prisma.tag.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.tag.delete({
      where: { id },
    });
  }
}
