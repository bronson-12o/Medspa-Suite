'use client';

import { useState } from 'react';
import { format } from 'date-fns';

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

interface LeadTableProps {
  leads: Lead[];
  tags: Tag[];
  stages: PipelineStage[];
  onStageUpdate: (leadId: string, stageId: string) => void;
  onTagsUpdate: (leadId: string, tagIds: string[]) => void;
}

export default function LeadTable({
  leads,
  tags,
  stages,
  onStageUpdate,
  onTagsUpdate,
}: LeadTableProps) {
  const [editingLead, setEditingLead] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<{ [leadId: string]: string[] }>({});

  const handleStageChange = (leadId: string, stageId: string) => {
    onStageUpdate(leadId, stageId);
  };

  const handleTagToggle = (leadId: string, tagId: string) => {
    const currentTags = selectedTags[leadId] || leads.find(l => l.id === leadId)?.tags.map(t => t.tag.id) || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    
    setSelectedTags(prev => ({ ...prev, [leadId]: newTags }));
    onTagsUpdate(leadId, newTags);
  };

  const getCurrentStage = (lead: Lead) => {
    return lead.stages[0]?.stage || null;
  };

  const getTagColor = (tagName: string) => {
    const tag = tags.find(t => t.name === tagName);
    return tag?.color || '#DDA0DD';
  };

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opportunity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => {
              const currentStage = getCurrentStage(lead);
              const leadTags = selectedTags[lead.id] || lead.tags.map(t => t.tag.id);
              
              return (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {lead.firstName?.charAt(0) || '?'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {lead.firstName || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead._count.activities} activities
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.email || 'No email'}</div>
                    <div className="text-sm text-gray-500">{lead.phone || 'No phone'}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.source || 'Unknown'}</div>
                    {lead.campaign && (
                      <div className="text-sm text-gray-500">{lead.campaign.name}</div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="text-sm border-0 bg-transparent focus:ring-2 focus:ring-primary-500"
                      value={currentStage?.id || ''}
                      onChange={(e) => handleStageChange(lead.id, e.target.value)}
                    >
                      {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map((tagWrapper) => {
                        const tag = tagWrapper.tag;
                        const isSelected = leadTags.includes(tag.id);
                        return (
                          <span
                            key={tag.id}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                              isSelected
                                ? 'bg-primary-100 text-primary-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                            style={{ backgroundColor: isSelected ? getTagColor(tag.name) + '20' : undefined }}
                            onClick={() => handleTagToggle(lead.id, tag.id)}
                          >
                            {tag.name}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.opportunity ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          ${(lead.opportunity.expectedValueCents / 100).toLocaleString()}
                        </div>
                        {lead.opportunity.procedureCode && (
                          <div className="text-sm text-gray-500">
                            {lead.opportunity.procedureCode}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No opportunity</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-primary-600 hover:text-primary-900"
                      onClick={() => setEditingLead(editingLead === lead.id ? null : lead.id)}
                    >
                      {editingLead === lead.id ? 'Cancel' : 'Edit'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {leads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No leads found</p>
        </div>
      )}
    </div>
  );
}
