'use client';

import { useEffect, useState } from 'react';
import { campaignsApi } from '@/lib/api';

interface Campaign {
  id: string;
  name: string;
  platform?: string;
  monthlySpendCents?: number;
  createdAt: string;
  _count: {
    leads: number;
  };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    platform: '',
    monthlySpendCents: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await campaignsApi.getAll();
        setCampaigns(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await campaignsApi.create(newCampaign);
      setNewCampaign({ name: '', platform: '', monthlySpendCents: 0 });
      setShowCreateForm(false);
      // Refresh campaigns
      const response = await campaignsApi.getAll();
      setCampaigns(response.data);
    } catch (err: any) {
      console.error('Failed to create campaign:', err);
    }
  };

  const handleUpdateSpend = async (campaignId: string, newSpend: number) => {
    try {
      await campaignsApi.update(campaignId, { monthlySpendCents: newSpend });
      // Refresh campaigns
      const response = await campaignsApi.getAll();
      setCampaigns(response.data);
    } catch (err: any) {
      console.error('Failed to update campaign spend:', err);
    }
  };

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
              Error loading campaigns
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your marketing campaigns and track performance
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Create Campaign
        </button>
      </div>

      {showCreateForm && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Campaign</h3>
          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div>
              <label className="label">Campaign Name</label>
              <input
                type="text"
                className="input"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Platform</label>
              <select
                className="input"
                value={newCampaign.platform}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, platform: e.target.value }))}
              >
                <option value="">Select Platform</option>
                <option value="facebook">Facebook</option>
                <option value="google">Google</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Monthly Spend ($)</label>
              <input
                type="number"
                className="input"
                value={newCampaign.monthlySpendCents / 100}
                onChange={(e) => setNewCampaign(prev => ({ 
                  ...prev, 
                  monthlySpendCents: Math.round(parseFloat(e.target.value || '0') * 100)
                }))}
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary">
                Create Campaign
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                {campaign.platform || 'Unknown'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Leads Generated</span>
                <span className="text-sm font-medium text-gray-900">
                  {campaign._count.leads}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Monthly Spend</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="text-sm border-0 bg-transparent focus:ring-2 focus:ring-primary-500 w-20"
                    value={campaign.monthlySpendCents ? campaign.monthlySpendCents / 100 : 0}
                    onChange={(e) => {
                      const newSpend = Math.round(parseFloat(e.target.value || '0') * 100);
                      handleUpdateSpend(campaign.id, newSpend);
                    }}
                    min="0"
                    step="0.01"
                  />
                  <span className="text-sm text-gray-500">$</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Created</span>
                <span className="text-sm text-gray-500">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No campaigns found</p>
          <button
            className="btn btn-primary mt-4"
            onClick={() => setShowCreateForm(true)}
          >
            Create Your First Campaign
          </button>
        </div>
      )}
    </div>
  );
}
