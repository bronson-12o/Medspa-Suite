'use client';

import { useEffect, useState } from 'react';
import { automationsApi } from '@/lib/api';

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  actions: Array<{
    type: string;
    template: string;
    delay: string | number;
  }>;
  enabled: boolean;
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    trigger: 'lead_created',
    conditions: [] as any[],
    actions: [] as any[],
    enabled: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await automationsApi.getAll();
        setAutomations(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch automations');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateAutomation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await automationsApi.create(newAutomation);
      setNewAutomation({
        name: '',
        description: '',
        trigger: 'lead_created',
        conditions: [],
        actions: [],
        enabled: true,
      });
      setShowCreateForm(false);
      // Refresh automations
      const response = await automationsApi.getAll();
      setAutomations(response.data);
    } catch (err: any) {
      console.error('Failed to create automation:', err);
    }
  };

  const handleToggleAutomation = async (automationId: string, enabled: boolean) => {
    try {
      await automationsApi.update(automationId, { enabled });
      // Refresh automations
      const response = await automationsApi.getAll();
      setAutomations(response.data);
    } catch (err: any) {
      console.error('Failed to toggle automation:', err);
    }
  };

  const handleExecuteAutomation = async (automationId: string) => {
    try {
      await automationsApi.execute(automationId, { test: true });
      alert('Automation executed successfully!');
    } catch (err: any) {
      console.error('Failed to execute automation:', err);
      alert('Failed to execute automation');
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
              Error loading automations
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
          <h1 className="text-2xl font-bold text-gray-900">Automations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set up automated workflows to nurture your leads
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Create Automation
        </button>
      </div>

      {showCreateForm && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Automation</h3>
          <form onSubmit={handleCreateAutomation} className="space-y-4">
            <div>
              <label className="label">Automation Name</label>
              <input
                type="text"
                className="input"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="input"
                rows={3}
                value={newAutomation.description}
                onChange={(e) => setNewAutomation(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Trigger</label>
              <select
                className="input"
                value={newAutomation.trigger}
                onChange={(e) => setNewAutomation(prev => ({ ...prev, trigger: e.target.value }))}
              >
                <option value="lead_created">Lead Created</option>
                <option value="stage_changed">Stage Changed</option>
                <option value="time_based">Time Based</option>
                <option value="consult_booked">Consultation Booked</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary">
                Create Automation
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

      <div className="grid grid-cols-1 gap-6">
        {automations.map((automation) => (
          <div key={automation.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{automation.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    automation.enabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {automation.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{automation.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Trigger</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {automation.trigger.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Actions</h4>
                    <div className="space-y-1">
                      {automation.actions.map((action, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          {action.type} - {action.template}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <button
                  className={`btn btn-sm ${automation.enabled ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => handleToggleAutomation(automation.id, !automation.enabled)}
                >
                  {automation.enabled ? 'Disable' : 'Enable'}
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleExecuteAutomation(automation.id)}
                >
                  Test
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {automations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No automations found</p>
          <button
            className="btn btn-primary mt-4"
            onClick={() => setShowCreateForm(true)}
          >
            Create Your First Automation
          </button>
        </div>
      )}
    </div>
  );
}
