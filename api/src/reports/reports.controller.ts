import { Controller, Get, Query, Headers } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly svc: ReportsService) {}

  private checkKey(key?: string) {
    if (!process.env.BACKEND_API_KEY) throw new Error('API key not configured');
    if (key !== process.env.BACKEND_API_KEY) throw new Error('Unauthorized');
  }

  @Get('revenue')
  async revenue(@Query('from') from?: string, @Query('to') to?: string, @Headers('x-api-key') key?: string) {
    this.checkKey(key);
    return this.svc.revenue(from, to);
  }

  @Get('conversions')
  async conv(@Query('from') from?: string, @Query('to') to?: string, @Headers('x-api-key') key?: string) {
    this.checkKey(key);
    return this.svc.conversions(from, to);
  }

  @Get('by-campaign')
  async byCamp(@Query('from') from?: string, @Query('to') to?: string, @Headers('x-api-key') key?: string) {
    this.checkKey(key);
    return this.svc.byCampaign(from, to);
  }

  @Get('revenue/daily')
  async revenueDaily(@Query('from') from?: string, @Query('to') to?: string, @Headers('x-api-key') key?: string) {
    this.checkKey(key);
    return this.svc.revenueDaily(from, to);
  }
}
