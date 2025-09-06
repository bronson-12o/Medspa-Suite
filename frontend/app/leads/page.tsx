'use client';

import { useEffect, useState } from 'react';
import { leadsApi, tagsApi, pipelinesApi } from '@/lib/api';
import LeadTable from '@/components/LeadTable';

interface Lead {
  id: string;
  firstName?: string;
  email?: string;
  phone?: string;
  source?: string;
  campaignId?: string;
  adPlatform?: string;
  createdAt: string;
  tags: Array<{
    tag: {
      id: string;
      name: string;
      color?: string;
    };
  }>;
  stages: Array<{
    stage: {
      id: string;
      name: string;
      color?: string;
    };
    changedAt: string;
  }>;
  opportunity?: {
    id: string;
    expectedValueCents: number;
    procedureCode?: string;
    expectedDate?: string;
  };
  campaign?: {
    id: string;
    name: string;
  };
  _count: {
    activities: number;
    kpiEvents: number;
  };
}

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color?: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    stageId: '',
    tagIds: [] as string[],
    campaignId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leadsResponse, tagsResponse, stagesResponse] = await Promise.all([
          leadsApi.getAll(filters),
          tagsApi.getAll(),
          pipelinesApi.getAll(),
        ]);
        
        setLeads(leadsResponse.data);
        setTags(tagsResponse.data);
        setStages(stagesResponse.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleStageUpdate = async (leadId: string, stageId: string) => {
    try {
      await leadsApi.updateStage(leadId, stageId);
      // Refresh leads data
      const response = await leadsApi.getAll(filters);
      setLeads(response.data);
    } catch (err: any) {
      console.error('Failed to update stage:', err);
    }
  };

  const handleTagsUpdate = async (leadId: string, tagIds: string[]) => {
    try {
      await leadsApi.updateTags(leadId, tagIds);
      // Refresh leads data
      const response = await leadsApi.getAll(filters);
      setLeads(response.data);
    } catch (err: any) {
      console.error('Failed to update tags:', err);
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
              Error loading leads
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track your leads
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Search</label>
            <input
              type="text"
              className="input"
              placeholder="Search leads..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
            />
          </div>
          
          <div>
            <label className="label">Stage</label>
            <select
              className="input"
              value={filters.stageId}
              onChange={(e) => handleFilterChange({ stageId: e.target.value })}
            >
              <option value="">All Stages</option>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="label">Tags</label>
            <select
              className="input"
              multiple
              value={filters.tagIds}
              onChange={(e) => {
                const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange({ tagIds: selectedTags });
              }}
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="label">Campaign</label>
            <select
              className="input"
              value={filters.campaignId}
              onChange={(e) => handleFilterChange({ campaignId: e.target.value })}
            >
              <option value="">All Campaigns</option>
              {/* Add campaign options here */}
            </select>
          </div>
        </div>
      </div>

      <LeadTable
        leads={leads}
        tags={tags}
        stages={stages}
        onStageUpdate={handleStageUpdate}
        onTagsUpdate={handleTagsUpdate}
      />
    </div>
  );
}
