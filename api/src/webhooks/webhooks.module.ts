import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { PrismaService } from '../common/prisma.service';
import { LeadsService } from '../leads/leads.service';
import { LeadsModule } from '../leads/leads.module';

@Module({
  imports: [LeadsModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, PrismaService],
})
export class WebhooksModule {}
