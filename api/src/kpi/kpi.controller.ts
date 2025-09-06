import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { ApiKeyGuard } from '../common/api-key.guard';

@Controller('dashboard')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get('kpi')
  getDashboardKpis(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.kpiService.getDashboardKpis(from, to);
  }

  @Post('kpi/events')
  @UseGuards(ApiKeyGuard)
  createKpiEvent(@Body() data: {
    leadId: string;
    kind: string;
    valueCents?: number;
    metadataJson?: any;
  }) {
    return this.kpiService.createKpiEvent(data);
  }
}
