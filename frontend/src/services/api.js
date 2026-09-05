import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.data && typeof error.response.data.data === 'object') {
      message = Object.values(error.response.data.data).join(', ');
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

// Authentication APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// Complaint APIs
export const complaintAPI = {
  create: (data) => api.post('/complaints', data),
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  track: (complaintNumber) => api.get(`/complaints/track/${complaintNumber}`),
  getMyComplaints: () => api.get('/complaints/my'),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  delete: (id) => api.delete(`/complaints/${id}`),
  resolve: (id, remark) => api.put(`/complaints/${id}/resolve`, { remark }),
  reject: (id, reason) => api.put(`/complaints/${id}/reject`, { reason }),
  startProgress: (id) => api.put(`/complaints/${id}/start-progress`),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  updateStatus: (id, data) => api.put(`/admin/complaints/${id}/status`, data),
  assignComplaint: (id, data) => api.put(`/admin/complaints/${id}/assign`, data),
  getUsers: (role) => api.get('/admin/users', { params: { role } }),
};

// Officer Portal APIs
export const officerPortalAPI = {
  getDashboard: () => api.get('/officer/dashboard'),
  getAssignedComplaints: (params) => api.get('/officer/complaints', { params }),
  startProgress: (id) => api.put(`/officer/complaints/${id}/start-progress`),
  resolve: (id, remark) => api.put(`/officer/complaints/${id}/resolve`, { remark }),
  reject: (id, reason) => api.put(`/officer/complaints/${id}/reject`, { reason }),
};

// Department APIs
export const departmentAPI = {
  getAll: (corporation) => api.get('/departments', { params: { corporation } }),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// Officer APIs
export const officerAPI = {
  getAll: (departmentId) => api.get('/officers', { params: { departmentId } }),
  getById: (id) => api.get(`/officers/${id}`),
  create: (data) => api.post('/officers', data),
  update: (id, data) => api.put(`/officers/${id}`, data),
  delete: (id) => api.delete(`/officers/${id}`),
};

// Feedback APIs
export const feedbackAPI = {
  submit: (data) => api.post('/feedback', data),
  getByComplaintId: (complaintId) => api.get(`/feedback/${complaintId}`),
};

// File Upload API
export const uploadAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
