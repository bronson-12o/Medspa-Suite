import { Injectable } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { GhlClient } from './ghl.client';

@Processor('sync')
@Injectable()
export class SyncWorker {
  constructor(private ghlClient: GhlClient) {}

  @Process('sync-contact')
  async handleContactSync(job: any) {
    const { contactData } = job.data;
    
    try {
      const result = await this.ghlClient.createOrUpdateContact(contactData);
      console.log('Contact synced to GHL:', result);
      return result;
    } catch (error) {
      console.error('Contact sync failed:', error);
      throw error;
    }
  }

  @Process('update-stage')
  async handleStageUpdate(job: any) {
    const { contactId, stageName } = job.data;
    
    try {
      const result = await this.ghlClient.updatePipelineStage(contactId, stageName);
      console.log('Stage updated in GHL:', result);
      return result;
    } catch (error) {
      console.error('Stage update failed:', error);
      throw error;
    }
  }

  @Process('add-tag')
  async handleAddTag(job: any) {
    const { contactId, tagName } = job.data;
    
    try {
      const result = await this.ghlClient.addTag(contactId, tagName);
      console.log('Tag added in GHL:', result);
      return result;
    } catch (error) {
      console.error('Tag addition failed:', error);
      throw error;
    }
  }

  @Process('remove-tag')
  async handleRemoveTag(job: any) {
    const { contactId, tagName } = job.data;
    
    try {
      const result = await this.ghlClient.removeTag(contactId, tagName);
      console.log('Tag removed in GHL:', result);
      return result;
    } catch (error) {
      console.error('Tag removal failed:', error);
      throw error;
    }
  }
}
