import axios from 'axios';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://windowscontrolcenterapi.runasp.net';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 / refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post(`${API_BASE}/api/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: { username: string; email: string; password: string; firstName?: string; lastName?: string; organizationName?: string }) =>
    api.post('/auth/register', data),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  me: () => api.get('/auth/me'),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
};

// Computers
export const computersApi = {
  list: (params?: Record<string, any>) => api.get('/computers', { params }),
  get: (id: string) => api.get(`/computers/${id}`),
  create: (data: any) => api.post('/computers', data),
  update: (id: string, data: any) => api.put(`/computers/${id}`, data),
  delete: (id: string) => api.delete(`/computers/${id}`),
  dashboard: () => api.get('/computers/dashboard'),
  metrics: (id: string, params?: Record<string, any>) => api.get(`/computers/${id}/metrics`, { params }),
  latestMetrics: (id: string) => api.get(`/computers/${id}/metrics/latest`),
  sendCommand: (id: string, commandType: string, parameters?: Record<string, string>) =>
    api.post(`/computers/${id}/command`, { commandType, parameters }),
  refreshProcesses: (id: string) => api.post(`/computers/${id}/processes/refresh`),
  refreshServices: (id: string) => api.post(`/computers/${id}/services/refresh`),
  listFiles: (id: string, path: string) => api.post(`/computers/${id}/files/list`, { path }),
  listDrives: (id: string) => api.post(`/computers/${id}/files/drives`),
};

// Alerts
export const alertsApi = {
  list: (params?: Record<string, any>) => api.get('/alerts', { params }),
  acknowledge: (id: string) => api.post(`/alerts/${id}/acknowledge`),
  resolve: (id: string) => api.post(`/alerts/${id}/resolve`),
  rules: () => api.get('/alerts/rules'),
  createRule: (data: any) => api.post('/alerts/rules', data),
};

// Agents
export const agentsApi = {
  generateCode: (data: { expirationMinutes?: number; scope?: string }) =>
    api.post('/agents/enrollment-codes', data),
  listCodes: (params?: Record<string, any>) => api.get('/agents/enrollment-codes', { params }),
  revokeCode: (id: string) => api.delete(`/agents/enrollment-codes/${id}`),
};

// Audit
export const auditApi = {
  list: (params?: Record<string, any>) => api.get('/audit', { params }),
};

export { API_BASE };
export default api;
