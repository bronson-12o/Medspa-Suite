'use client';

import { useEffect, useState } from 'react';
import { kpiApi } from '@/lib/api';
import KpiCards from '@/components/KpiCards';

interface DashboardData {
  summary: {
    totalLeads: number;
    consultBooked: number;
    consultShown: number;
    totalRevenue: number;
    totalSpend: number;
    roi: number;
    leadToConsultRate: number;
    consultToShowRate: number;
    showToWonRate: number;
  };
  leadsBySource: Array<{
    source: string;
    count: number;
  }>;
  leadsByCampaign: Array<{
    campaignId: string;
    campaignName: string;
    leadCount: number;
    monthlySpend: number;
  }>;
  period: {
    from: string;
    to: string;
  };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await kpiApi.getDashboard();
        setData(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading dashboard
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Period: {new Date(data.period.from).toLocaleDateString()} - {new Date(data.period.to).toLocaleDateString()}
        </p>
      </div>

      <KpiCards data={data.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Source */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Leads by Source</h3>
          <div className="space-y-3">
            {data.leadsBySource.map((source) => (
              <div key={source.source} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {source.source || 'Unknown'}
                </span>
                <span className="text-sm text-gray-500">
                  {source.count} leads
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Performance</h3>
          <div className="space-y-3">
            {data.leadsByCampaign.map((campaign) => (
              <div key={campaign.campaignId} className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    {campaign.campaignName}
                  </span>
                  <div className="text-xs text-gray-500">
                    ${(campaign.monthlySpend / 100).toFixed(0)} spend
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {campaign.leadCount} leads
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
