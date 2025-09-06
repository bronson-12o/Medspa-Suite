import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

@Injectable()
export class GhlClient {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://services.leadconnectorhq.com';

  constructor() {
    this.apiKey = process.env.GHL_API_KEY || '';
  }

  async createOrUpdateContact(contactData: {
    externalId?: string;
    firstName?: string;
    email?: string;
    phone?: string;
    source?: string;
  }) {
    // Only send metadata, no PHI
    const safeData = {
      firstName: contactData.firstName,
      email: contactData.email,
      phone: contactData.phone,
      source: contactData.source,
      customFields: {
        externalId: contactData.externalId,
      },
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/contacts/`,
        safeData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('GHL contact creation error:', error.response?.data ?? error.message);
      } else if (error instanceof Error) {
        console.error('GHL contact creation error:', error.message);
      } else {
        console.error('GHL contact creation error:', error);
      }
      throw new Error('Failed to sync contact to GHL');
    }
  }

  async updatePipelineStage(contactId: string, stageName: string) {
    // Map our internal stages to GHL stages
    const stageMapping: { [key: string]: string } = {
      'New': 'new',
      'Contacted': 'contacted',
      'Consult Booked': 'qualified',
      'Won': 'won',
      'Lost': 'lost',
    };

    const ghlStage = stageMapping[stageName] || 'new';

    try {
      const response = await axios.put(
        `${this.baseUrl}/contacts/${contactId}`,
        {
          pipelineStage: ghlStage,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('GHL stage update error:', error.response?.data ?? error.message);
      } else if (error instanceof Error) {
        console.error('GHL stage update error:', error.message);
      } else {
        console.error('GHL stage update error:', error);
      }
      throw new Error('Failed to update GHL stage');
    }
  }

  async addTag(contactId: string, tagName: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/contacts/${contactId}/tags`,
        {
          tag: tagName,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('GHL tag addition error:', error.response?.data ?? error.message);
      } else if (error instanceof Error) {
        console.error('GHL tag addition error:', error.message);
      } else {
        console.error('GHL tag addition error:', error);
      }
      throw new Error('Failed to add GHL tag');
    }
  }

  async removeTag(contactId: string, tagName: string) {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/contacts/${contactId}/tags/${tagName}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('GHL tag removal error:', error.response?.data ?? error.message);
      } else if (error instanceof Error) {
        console.error('GHL tag removal error:', error.message);
      } else {
        console.error('GHL tag removal error:', error);
      }
      throw new Error('Failed to remove GHL tag');
    }
  }
}
