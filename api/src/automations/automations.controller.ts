import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { ApiKeyGuard } from '../common/api-key.guard';

@Controller('automations')
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Get()
  findAll() {
    return this.automationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.automationsService.findOne(id);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() automation: any) {
    return this.automationsService.create(automation);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  update(@Param('id') id: string, @Body() updates: any) {
    return this.automationsService.update(id, updates);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  remove(@Param('id') id: string) {
    return this.automationsService.delete(id);
  }

  @Post(':id/execute')
  @UseGuards(ApiKeyGuard)
  execute(@Param('id') id: string, @Body() context: any) {
    return this.automationsService.executeAutomation(id, context);
  }
}
