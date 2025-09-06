import { Module } from '@nestjs/common';
import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesService } from './opportunities.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService, PrismaService],
  exports: [OpportunitiesService],
})
export class OpportunitiesModule {}
