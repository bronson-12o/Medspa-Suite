'use client';

import { format } from 'date-fns';

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

interface PipelineBoardProps {
  stages: PipelineStage[];
}

export default function PipelineBoard({ stages }: PipelineBoardProps) {
  const getStageColor = (color?: string) => {
    return color || '#3B82F6';
  };

  const getTagColor = (color?: string) => {
    return color || '#DDA0DD';
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-6 min-w-max pb-6">
        {stages.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-80">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="text-lg font-medium text-gray-900"
                  style={{ color: getStageColor(stage.color) }}
                >
                  {stage.name}
                </h3>
                <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                  {stage.leads.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {stage.leads.map((leadWrapper) => {
                  const lead = leadWrapper.lead;
                  return (
                    <div
                      key={lead.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary-700">
                                {lead.firstName?.charAt(0) || '?'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {lead.firstName || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {lead.email || lead.phone || 'No contact'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {lead.source && (
                        <div className="mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {lead.source}
                          </span>
                        </div>
                      )}
                      
                      {lead.tags.length > 0 && (
                        <div className="mb-2">
                          <div className="flex flex-wrap gap-1">
                            {lead.tags.map((tagWrapper) => {
                              const tag = tagWrapper.tag;
                              return (
                                <span
                                  key={tag.id}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                  style={{ 
                                    backgroundColor: getTagColor(tag.color) + '20',
                                    color: getTagColor(tag.color)
                                  }}
                                >
                                  {tag.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {lead.opportunity && (
                        <div className="mb-2">
                          <div className="text-sm font-medium text-gray-900">
                            ${(lead.opportunity.expectedValueCents / 100).toLocaleString()}
                          </div>
                          {lead.opportunity.procedureCode && (
                            <div className="text-xs text-gray-500">
                              {lead.opportunity.procedureCode}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-400">
                        {format(new Date(leadWrapper.changedAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  );
                })}
                
                {stage.leads.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No leads in this stage</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
