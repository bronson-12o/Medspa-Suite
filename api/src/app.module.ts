import { ReportsModule } from './reports/reports.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaService } from './common/prisma.service';
import { HealthModule } from './health/health.module';
import { LeadsModule } from './leads/leads.module';
import { TagsModule } from './tags/tags.module';
import { PipelinesModule } from './pipelines/pipelines.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { ActivitiesModule } from './activities/activities.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { KpiModule } from './kpi/kpi.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { SyncModule } from './sync/sync.module';
import { AutomationsModule } from './automations/automations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    LeadsModule,
    TagsModule,
    PipelinesModule,
    OpportunitiesModule,
    ActivitiesModule,
    CampaignsModule,
    KpiModule,
    WebhooksModule,
    SyncModule,
    AutomationsModule,
    ReportsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
