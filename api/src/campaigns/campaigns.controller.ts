import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { ApiKeyGuard } from '../common/api-key.guard';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  findAll() {
    return this.campaignsService.findAll();
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() data: {
    name: string;
    platform?: string;
    monthlySpendCents?: number;
  }) {
    return this.campaignsService.create(data);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  update(@Param('id') id: string, @Body() data: {
    name?: string;
    platform?: string;
    monthlySpendCents?: number;
  }) {
    return this.campaignsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  remove(@Param('id') id: string) {
    return this.campaignsService.delete(id);
  }
}
