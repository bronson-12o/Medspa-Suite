import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ReportsService {
  /**
   * Inclusive date range helper (UTC).
   * If `to` is YYYY-MM-DD, include the entire day by converting it to
   * the *next* midnight in UTC and using lt (exclusive upper bound).
   * Example: to=2025-09-05 -> 2025-09-06T00:00:00.000Z
   */
  private toEndExclusiveUTC(to?: string) {
    if (!to) return undefined;
    const startUtc = new Date(`${to}T00:00:00.000Z`);
    return new Date(startUtc.getTime() + 24 * 60 * 60 * 1000);
  }

  /**
   * Normalize "from" to start-of-day UTC if provided as YYYY-MM-DD.
   * If the client ever passes an ISO string w/ time, this still works.
   */
  private fromStartUTC(from?: string) {
    if (!from) return undefined;
    // If 'from' already includes time/zone, Date() will honor it. For plain YYYY-MM-DD, we pin to UTC midnight.
    return from.match(/^\d{4}-\d{2}-\d{2}$/)
      ? new Date(`${from}T00:00:00.000Z`)
      : new Date(from);
  }

  async revenue(from?: string, to?: string) {
    const where = {
      kind: 'invoice_paid' as const,
      occurredAt: {
        gte: this.fromStartUTC(from),
        lt: this.toEndExclusiveUTC(to),
      },
    };

    const events = await prisma.kpiEvent.findMany({
      where,
      select: { valueCents: true },
    });

    const totalCents = events.reduce((a, e) => a + (e.valueCents ?? 0), 0);
    return { totalCents, total: totalCents / 100 };
  }

  async conversions(from?: string, to?: string) {
    const range = {
      gte: this.fromStartUTC(from),
      lt: this.toEndExclusiveUTC(to),
    };

    const consultBooked = await prisma.kpiEvent.count({
      where: { kind: 'consult_booked', occurredAt: range },
    });
    const consultShow = await prisma.kpiEvent.count({
      where: { kind: 'consult_show', occurredAt: range },
    });
    const invoicePaid = await prisma.kpiEvent.count({
      where: { kind: 'invoice_paid', occurredAt: range },
    });

    return { consultBooked, consultShow, invoicePaid };
  }

  async byCampaign(from?: string, to?: string) {
    const range = {
      gte: this.fromStartUTC(from),
      lt: this.toEndExclusiveUTC(to),
    };

    // revenue by campaign (join via leadId -> Lead.campaignId)
    const events = await prisma.kpiEvent.findMany({
      where: { kind: 'invoice_paid', occurredAt: range },
      select: { valueCents: true, leadId: true },
    });

    const leads = await prisma.lead.findMany({
      select: { id: true, campaignId: true },
    });

    const campaigns = await prisma.campaign.findMany({
      select: { id: true, name: true, monthlySpendCents: true },
    });

    const leadToCampaign = new Map(leads.map((l) => [l.id, l.campaignId]));
    const agg = new Map<string, { revenueCents: number }>();

    for (const e of events) {
      const cid = leadToCampaign.get(e.leadId ?? '') ?? 'unknown';
      const curr = agg.get(cid) ?? { revenueCents: 0 };
      agg.set(cid, { revenueCents: curr.revenueCents + (e.valueCents ?? 0) });
    }

    const rows = [...agg.entries()].map(([campaignId, v]) => {
      const c = campaigns.find((x) => x.id === campaignId);
      const spendCents = c?.monthlySpendCents ?? 0;
      const roas = spendCents ? v.revenueCents / spendCents : null;
      return {
        campaignId,
        campaignName: c?.name ?? 'Unknown',
        spendCents,
        spend: spendCents / 100,
        revenueCents: v.revenueCents,
        revenue: v.revenueCents / 100,
        roas,
      };
    });

    return rows.sort((a, b) => b.revenueCents - a.revenueCents);
  }
}
