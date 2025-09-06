import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ApiKeyGuard } from '../common/api-key.guard';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('lead/:leadId')
  findByLeadId(@Param('leadId') leadId: string) {
    return this.activitiesService.findByLeadId(leadId);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() data: {
    leadId: string;
    type: string;
    payloadJson?: any;
  }) {
    return this.activitiesService.create(data);
  }
}
