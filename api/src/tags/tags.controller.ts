import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiKeyGuard } from '../common/api-key.guard';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() data: { name: string; color?: string }) {
    return this.tagsService.create(data);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  update(@Param('id') id: string, @Body() data: { name?: string; color?: string }) {
    return this.tagsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  remove(@Param('id') id: string) {
    return this.tagsService.delete(id);
  }
}
