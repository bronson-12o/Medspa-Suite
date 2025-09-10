'use client';

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagEditorProps {
  leadId: string;
  currentTags: Tag[];
  availableTags: Tag[];
  onTagsUpdate: (leadId: string, tagIds: string[]) => void;
  onClose: () => void;
}

export default function TagEditor({ 
  leadId, 
  currentTags, 
  availableTags, 
  onTagsUpdate, 
  onClose 
}: TagEditorProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    currentTags.map(tag => tag.id)
  );

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = () => {
    onTagsUpdate(leadId, selectedTagIds);
    onClose();
  };

  const handleCancel = () => {
    setSelectedTagIds(currentTags.map(tag => tag.id));
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Tags</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Select tags for this lead:
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableTags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              
              return (
                <label
                  key={tag.id}
                  className="flex items-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleTagToggle(tag.id)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span
                    className={clsx(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      tag.color 
                        ? `bg-${tag.color}-100 text-${tag.color}-800` 
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {tag.name}
                  </span>
                </label>
              );
            })}
          </div>

          {availableTags.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No tags available. Create some tags first.
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}