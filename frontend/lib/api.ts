import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
const API_KEY = process.env.NEXT_PUBLIC_FRONT_API_KEY;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'x-api-key': API_KEY }),
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

// API functions
export const leadsApi = {
  getAll: (filters?: {
    search?: string;
    stageId?: string;
    tagIds?: string[];
    campaignId?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.stageId) params.append('stageId', filters.stageId);
    if (filters?.tagIds?.length) params.append('tagIds', filters.tagIds.join(','));
    if (filters?.campaignId) params.append('campaignId', filters.campaignId);
    
    return api.get(`/leads?${params.toString()}`);
  },
  
  getById: (id: string) => api.get(`/leads/${id}`),
  
  create: (data: any) => api.post('/leads', data),
  
  updateStage: (id: string, stageId: string) => 
    api.patch(`/leads/${id}/stage`, { stageId }),
  
  updateTags: (id: string, tagIds: string[]) => 
    api.patch(`/leads/${id}/tags`, { tagIds }),
  
  delete: (id: string) => api.delete(`/leads/${id}`),
};

export const kpiApi = {
  getDashboard: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    
    return api.get(`/dashboard/kpi?${params.toString()}`);
  },
  
  createEvent: (data: {
    leadId: string;
    kind: string;
    valueCents?: number;
    metadataJson?: any;
  }) => api.post('/dashboard/kpi/events', data),
};

export const tagsApi = {
  getAll: () => api.get('/tags'),
  create: (data: { name: string; color?: string }) => api.post('/tags', data),
  update: (id: string, data: { name?: string; color?: string }) => 
    api.patch(`/tags/${id}`, data),
  delete: (id: string) => api.delete(`/tags/${id}`),
};

export const pipelinesApi = {
  getAll: () => api.get('/pipelines'),
  create: (data: { name: string; order: number; color?: string }) => 
    api.post('/pipelines', data),
  update: (id: string, data: { name?: string; order?: number; color?: string }) => 
    api.patch(`/pipelines/${id}`, data),
  delete: (id: string) => api.delete(`/pipelines/${id}`),
};

export const campaignsApi = {
  getAll: () => api.get('/campaigns'),
  create: (data: { name: string; platform?: string; monthlySpendCents?: number }) => 
    api.post('/campaigns', data),
  update: (id: string, data: { name?: string; platform?: string; monthlySpendCents?: number }) => 
    api.patch(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
};

export const opportunitiesApi = {
  create: (data: {
    leadId: string;
    expectedValueCents: number;
    procedureCode?: string;
    expectedDate?: string;
  }) => api.post('/opportunities', data),
  
  update: (id: string, data: {
    expectedValueCents?: number;
    procedureCode?: string;
    expectedDate?: string;
  }) => api.patch(`/opportunities/${id}`, data),
  
  getByLeadId: (leadId: string) => api.get(`/opportunities/lead/${leadId}`),
};

export const automationsApi = {
  getAll: () => api.get('/automations'),
  getById: (id: string) => api.get(`/automations/${id}`),
  create: (data: any) => api.post('/automations', data),
  update: (id: string, data: any) => api.patch(`/automations/${id}`, data),
  delete: (id: string) => api.delete(`/automations/${id}`),
  execute: (id: string, context: any) => api.post(`/automations/${id}/execute`, context),
};

export const reportsApi = {
  getRevenue: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    
    return api.get(`/reports/revenue/daily?${params.toString()}`);
  },
};

// Additional fetch helpers as requested in superprompt
const API = process.env.NEXT_PUBLIC_API_BASE!;
const HEADERS = { 'x-api-key': process.env.NEXT_PUBLIC_FRONT_API_KEY! };

export async function getStages(pipelineId: string) {
  const res = await fetch(`${API}/pipelines/${pipelineId}/stages`, { headers: HEADERS });
  if (!res.ok) throw new Error('Failed to fetch stages');
  return res.json();
}

export async function moveLead(leadId: string, stageId: string) {
  const res = await fetch(`${API}/leads/${leadId}`, {
    method: 'PATCH',
    headers: { ...HEADERS, 'content-type': 'application/json' },
    body: JSON.stringify({ stageId }),
  });
  if (!res.ok) throw new Error('Failed to move lead');
}
