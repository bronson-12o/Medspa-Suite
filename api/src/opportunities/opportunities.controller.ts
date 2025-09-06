import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { ApiKeyGuard } from '../common/api-key.guard';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() data: {
    leadId: string;
    expectedValueCents: number;
    procedureCode?: string;
    expectedDate?: string;
  }) {
    return this.opportunitiesService.create({
      ...data,
      expectedDate: data.expectedDate ? new Date(data.expectedDate) : undefined,
    });
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  update(@Param('id') id: string, @Body() data: {
    expectedValueCents?: number;
    procedureCode?: string;
    expectedDate?: string;
  }) {
    return this.opportunitiesService.update(id, {
      ...data,
      expectedDate: data.expectedDate ? new Date(data.expectedDate) : undefined,
    });
  }

  @Get('lead/:leadId')
  findByLeadId(@Param('leadId') leadId: string) {
    return this.opportunitiesService.findByLeadId(leadId);
  }
}
