import { Injectable } from '@nestjs/common';

@Injectable()
export class AutomationsService {
  private automations = [
    {
      id: '1',
      name: 'New Lead Welcome',
      description: 'Send welcome message to new leads',
      trigger: 'lead_created',
      conditions: [],
      actions: [
        {
          type: 'send_email',
          template: 'welcome',
          delay: 0,
        },
      ],
      enabled: true,
    },
    {
      id: '2',
      name: 'Follow-up After 24h',
      description: 'Follow up with leads who haven\'t been contacted',
      trigger: 'time_based',
      conditions: [
        {
          field: 'stage',
          operator: 'equals',
          value: 'New',
        },
        {
          field: 'created_at',
          operator: 'older_than',
          value: '24h',
        },
      ],
      actions: [
        {
          type: 'send_sms',
          template: 'follow_up',
          delay: 0,
        },
      ],
      enabled: true,
    },
    {
      id: '3',
      name: 'Consult Reminder',
      description: 'Send reminder 1 hour before consultation',
      trigger: 'consult_booked',
      conditions: [],
      actions: [
        {
          type: 'send_sms',
          template: 'consult_reminder',
          delay: '1h_before',
        },
      ],
      enabled: true,
    },
    {
      id: '4',
      name: 'Post-Consult Follow-up',
      description: 'Follow up after consultation if not converted',
      trigger: 'consult_completed',
      conditions: [
        {
          field: 'stage',
          operator: 'not_equals',
          value: 'Won',
        },
      ],
      actions: [
        {
          type: 'send_email',
          template: 'post_consult',
          delay: '24h',
        },
      ],
      enabled: true,
    },
  ];

  async findAll() {
    return this.automations;
  }

  async findOne(id: string) {
    return this.automations.find(automation => automation.id === id);
  }

  async create(automation: any) {
    const newAutomation = {
      id: (this.automations.length + 1).toString(),
      ...automation,
    };
    this.automations.push(newAutomation);
    return newAutomation;
  }

  async update(id: string, updates: any) {
    const index = this.automations.findIndex(automation => automation.id === id);
    if (index === -1) {
      throw new Error('Automation not found');
    }
    this.automations[index] = { ...this.automations[index], ...updates };
    return this.automations[index];
  }

  async delete(id: string) {
    const index = this.automations.findIndex(automation => automation.id === id);
    if (index === -1) {
      throw new Error('Automation not found');
    }
    return this.automations.splice(index, 1)[0];
  }

  async executeAutomation(automationId: string, context: any) {
    const automation = await this.findOne(automationId);
    if (!automation || !automation.enabled) {
      return;
    }

    console.log(`Executing automation: ${automation.name}`, context);

    // For now, just log the actions
    // In a real implementation, this would trigger actual actions
    automation.actions.forEach(action => {
      console.log(`Action: ${action.type}`, {
        template: action.template,
        delay: action.delay,
        context,
      });
    });

    return { success: true, actionsExecuted: automation.actions.length };
  }
}
