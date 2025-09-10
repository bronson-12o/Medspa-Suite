'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import TagEditor from './TagEditor';
import clsx from 'clsx';

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

interface LeadCardProps {
  lead: Lead;
  onTagsUpdate: (leadId: string, tagIds: string[]) => void;
  availableTags: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
}

export default function LeadCard({ lead, onTagsUpdate, availableTags }: LeadCardProps) {
  const [showTagEditor, setShowTagEditor] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const displayName = `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Unknown Lead';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        'bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move',
        'hover:shadow-md transition-shadow duration-200',
        isDragging && 'opacity-50'
      )}
    >
      <div className="space-y-3">
        {/* Lead Name */}
        <div>
          <h4 className="font-medium text-gray-900 text-sm">{displayName}</h4>
          {lead.source && (
            <p className="text-xs text-gray-500 mt-1">Source: {lead.source}</p>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-1">
          {lead.email && (
            <div className="flex items-center text-xs text-gray-600">
              <EnvelopeIcon className="h-3 w-3 mr-1" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center text-xs text-gray-600">
              <PhoneIcon className="h-3 w-3 mr-1" />
              <span>{lead.phone}</span>
            </div>
          )}
        </div>

        {/* Opportunity Value */}
        {lead.opportunity && (
          <div className="text-xs">
            <span className="font-medium text-green-600">
              ${(lead.opportunity.expectedValueCents / 100).toLocaleString()}
            </span>
            {lead.opportunity.procedureCode && (
              <span className="text-gray-500 ml-2">
                {lead.opportunity.procedureCode}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {lead.tags.slice(0, 3).map(({ tag }) => (
              <span
                key={tag.id}
                className={clsx(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                  tag.color ? `bg-${tag.color}-100 text-${tag.color}-800` : 'bg-gray-100 text-gray-800'
                )}
              >
                {tag.name}
              </span>
            ))}
            {lead.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                +{lead.tags.length - 3} more
              </span>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTagEditor(!showTagEditor);
            }}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showTagEditor ? 'Close' : 'Edit Tags'}
          </button>
        </div>

        {/* Tag Editor */}
        {showTagEditor && (
          <TagEditor
            leadId={lead.id}
            currentTags={lead.tags.map(t => t.tag)}
            availableTags={availableTags}
            onTagsUpdate={onTagsUpdate}
            onClose={() => setShowTagEditor(false)}
          />
        )}

        {/* Created Date */}
        <div className="text-xs text-gray-400">
          {new Date(lead.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}