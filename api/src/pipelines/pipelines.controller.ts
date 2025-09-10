import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';
import { ApiKeyGuard } from '../common/api-key.guard';
import { ReorderStagesDto } from './dto/reorder.dto';

@Controller('pipelines')
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Get()
  findAll() {
    return this.pipelinesService.findAll();
  }

  @Get(':id/stages')
  getStagesWithCounts(@Param('id') id: string) {
    return this.pipelinesService.getStagesWithCounts(id);
  }

  @Post(':id/stages/reorder')
  @UseGuards(ApiKeyGuard)
  reorderStages(@Param('id') id: string, @Body() dto: ReorderStagesDto) {
    return this.pipelinesService.reorderStages(id, dto.stageIds);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() data: { name: string; order: number; color?: string }) {
    return this.pipelinesService.create(data);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  update(@Param('id') id: string, @Body() data: { name?: string; order?: number; color?: string }) {
    return this.pipelinesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  remove(@Param('id') id: string) {
    return this.pipelinesService.delete(id);
  }
}
