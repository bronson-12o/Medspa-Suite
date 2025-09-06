import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class KpiService {
  constructor(private prisma: PrismaService) {}

  async getDashboardKpis(from?: string, to?: string) {
    const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const toDate = to ? new Date(to) : new Date();

    // Get total leads in period
    const totalLeads = await this.prisma.lead.count({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
    });

    // Get leads with consult booked
    const consultBooked = await this.prisma.kpiEvent.count({
      where: {
        kind: 'consult_booked',
        occurredAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
    });

    // Get leads with consult shown
    const consultShown = await this.prisma.kpiEvent.count({
      where: {
        kind: 'consult_show',
        occurredAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
    });

    // Get revenue (invoice_paid events)
    const revenueEvents = await this.prisma.kpiEvent.findMany({
      where: {
        kind: 'invoice_paid',
        occurredAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
    });

    const totalRevenue = revenueEvents.reduce((sum, event) => sum + (event.valueCents || 0), 0);

    // Get campaign spend
    const campaigns = await this.prisma.campaign.findMany({
      where: {
        createdAt: {
          lte: toDate,
        },
      },
    });

    const totalSpend = campaigns.reduce((sum, campaign) => sum + (campaign.monthlySpendCents || 0), 0);

    // Calculate conversion rates
    const leadToConsultRate = totalLeads > 0 ? (consultBooked / totalLeads) * 100 : 0;
    const consultToShowRate = consultBooked > 0 ? (consultShown / consultBooked) * 100 : 0;
    const showToWonRate = consultShown > 0 ? (revenueEvents.length / consultShown) * 100 : 0;

    // Calculate ROI
    const roi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

    // Get leads by source
    const leadsBySource = await this.prisma.lead.groupBy({
      by: ['source'],
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      _count: {
        id: true,
      },
    });

    // Get leads by campaign
    const leadsByCampaign = await this.prisma.lead.groupBy({
      by: ['campaignId'],
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
        campaignId: {
          not: null,
        },
      },
      _count: {
        id: true,
      },
    });

    // Get campaign details for leads by campaign
    const campaignIds = leadsByCampaign
      .map(l => l.campaignId)
      .filter((id): id is string => typeof id === 'string' && id.length > 0);
    
    const campaignDetails = await this.prisma.campaign.findMany({
      where: {
        id: {
          in: campaignIds,
        },
      },
    });

    const leadsByCampaignWithDetails = leadsByCampaign.map(lead => {
      const campaign = campaignDetails.find(c => c.id === lead.campaignId);
      return {
        campaignId: lead.campaignId,
        campaignName: campaign?.name || 'Unknown',
        leadCount: lead._count.id,
        monthlySpend: campaign?.monthlySpendCents || 0,
      };
    });

    return {
      summary: {
        totalLeads,
        consultBooked,
        consultShown,
        totalRevenue: totalRevenue / 100, // Convert cents to dollars
        totalSpend: totalSpend / 100, // Convert cents to dollars
        roi,
        leadToConsultRate: Math.round(leadToConsultRate * 100) / 100,
        consultToShowRate: Math.round(consultToShowRate * 100) / 100,
        showToWonRate: Math.round(showToWonRate * 100) / 100,
      },
      leadsBySource: leadsBySource.map(source => ({
        source: source.source || 'Unknown',
        count: source._count.id,
      })),
      leadsByCampaign: leadsByCampaignWithDetails,
      period: {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      },
    };
  }

  async createKpiEvent(data: {
    leadId: string;
    kind: string;
    valueCents?: number;
    metadataJson?: any;
  }) {
    return this.prisma.kpiEvent.create({
      data: {
        leadId: data.leadId,
        kind: data.kind,
        valueCents: data.valueCents,
        metadataJson: data.metadataJson,
      },
    });
  }
}
