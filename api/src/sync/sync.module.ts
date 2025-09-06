import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { GhlClient } from './ghl.client';
import { SyncWorker } from './sync.worker';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sync',
    }),
  ],
  providers: [GhlClient, SyncWorker],
  exports: [GhlClient],
})
export class SyncModule {}
