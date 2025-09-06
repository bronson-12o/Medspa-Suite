import { Module } from '@nestjs/common';
import { AutomationsController } from './automations.controller';
import { AutomationsService } from './automations.service';
import { Scheduler } from './scheduler';

@Module({
  controllers: [AutomationsController],
  providers: [AutomationsService, Scheduler],
  exports: [AutomationsService],
})
export class AutomationsModule {}
