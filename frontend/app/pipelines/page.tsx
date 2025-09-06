'use client';

import { useEffect, useState } from 'react';
import { pipelinesApi } from '@/lib/api';
import PipelineBoard from '@/components/PipelineBoard';

interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color?: string;
  leads: Array<{
    lead: {
      id: string;
      firstName?: string;
      email?: string;
      phone?: string;
      source?: string;
      tags: Array<{
        tag: {
          id: string;
          name: string;
          color?: string;
        };
      }>;
      opportunity?: {
        id: string;
        expectedValueCents: number;
        procedureCode?: string;
      };
    };
    changedAt: string;
  }>;
}

export default function PipelinesPage() {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await pipelinesApi.getAll();
        setStages(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch pipeline data');
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
              Error loading pipelines
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
        <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visualize your leads through the sales pipeline
        </p>
      </div>

      <PipelineBoard stages={stages} />
    </div>
  );
}
