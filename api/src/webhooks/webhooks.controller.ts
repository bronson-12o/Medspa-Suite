import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { ApiKeyGuard } from '../common/api-key.guard';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('ghl/lead')
  @UseGuards(ApiKeyGuard)
  async handleGhlLead(
    @Body() webhookData: any,
    @Headers('x-ghl-signature') signature?: string,
  ) {
    // In production, verify GHL signature here
    // For now, we'll just log it
    if (signature) {
      console.log('GHL signature received:', signature);
    }

    try {
      const result = await this.webhooksService.handleGhlLead(webhookData);
      return {
        success: true,
        leadId: result.id,
        message: 'Lead processed successfully',
      };
    } catch (error) {
      console.error('Error processing GHL webhook:', error);
      return {
        success: false,
        error: 'Failed to process lead',
      };
    }
  }
}
