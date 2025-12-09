const API_BASE = '/api';

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return res.json();
}

export async function api<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  return handleResponse(res);
}

// Auth
export const auth = {
  signup: (data: { email: string; password: string; name: string }) =>
    api('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    api('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => api('/auth/logout', { method: 'POST' }),
  refresh: () => api('/auth/refresh', { method: 'POST' }),
};

// Users
export const users = {
  me: () => api('/users/me'),
  update: (data: any) => api('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
  get: (id: string) => api(`/users/${id}`),
};

// Skills
export const skills = {
  list: (params?: { category?: string; search?: string; userId?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return api(`/skills${query ? `?${query}` : ''}`);
  },
  mine: () => api('/skills/mine'),
  get: (id: string) => api(`/skills/${id}`),
  create: (data: any) => api('/skills', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => api(`/skills/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/skills/${id}`, { method: 'DELETE' }),
};

// Needs
export const needs = {
  list: (params?: { category?: string; search?: string; userId?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return api(`/needs${query ? `?${query}` : ''}`);
  },
  mine: () => api('/needs/mine'),
  get: (id: string) => api(`/needs/${id}`),
  create: (data: any) => api('/needs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => api(`/needs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/needs/${id}`, { method: 'DELETE' }),
};

// Requests
export const requests = {
  list: (type?: 'sent' | 'received' | 'all') => api(`/requests${type ? `?type=${type}` : ''}`),
  create: (data: { skillId: string; message?: string }) =>
    api('/requests', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, status: string) =>
    api(`/requests/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// Connections
export const connections = {
  list: () => api('/connections'),
  createInvite: () => api('/connections/invite', { method: 'POST' }),
  acceptInvite: (code: string) => api(`/connections/accept/${code}`, { method: 'POST' }),
  remove: (userId: string) => api(`/connections/${userId}`, { method: 'DELETE' }),
};

// Categories
export const categories = {
  list: () => api('/categories'),
};
