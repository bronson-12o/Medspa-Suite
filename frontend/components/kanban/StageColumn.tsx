'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import LeadCard from './LeadCard';

interface Lead {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  source?: string;
  createdAt: string;
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
    expectedDate?: string;
  };
}

interface Stage {
  id: string;
  name: string;
  order: number;
  color?: string;
}

interface StageColumnProps {
  stage: Stage;
  leads: Lead[];
  onTagsUpdate: (leadId: string, tagIds: string[]) => void;
  availableTags: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
}

export default function StageColumn({ 
  stage, 
  leads, 
  onTagsUpdate, 
  availableTags 
}: StageColumnProps) {
  const { setNodeRef } = useDroppable({
    id: stage.id,
  });

  return (
    <div className="bg-gray-50 rounded-lg p-4 min-w-80 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{stage.name}</h3>
        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
          {leads.length}
        </span>
      </div>
      
      <div 
        ref={setNodeRef}
        className="min-h-[200px] space-y-2"
      >
        <SortableContext 
          items={leads.map(lead => lead.id)} 
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onTagsUpdate={onTagsUpdate}
              availableTags={availableTags}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}