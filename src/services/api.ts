import axios from 'axios';

const apiClient = axios.create({ baseURL: '/api' });

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Audit (always local) ────────────────────────────────────────────────────
const pushAuditLog = (action: string, userName: string, details: string) => {
  const raw = localStorage.getItem('auditLogs');
  const logs = raw ? JSON.parse(raw) : [];
  logs.unshift({ id: Date.now(), date: new Date().toISOString(), userName, action, details });
  localStorage.setItem('auditLogs', JSON.stringify(logs));
};

// ─── API Service ─────────────────────────────────────────────────────────────
const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await apiClient.post('/auth/login', { email, password });
      const token = response.data?.token || response.data;
      if (typeof token === 'string' && token.length > 20) {
        localStorage.setItem('token', token);
      }

      let user = null;
      try {
        const profileRes = await apiClient.get('/users/my-profile');
        user = profileRes.data;
      } catch (err: any) {
        console.warn('Could not fetch user profile', err);
        user = { name: email, email, role: 'USER' };
      }

      pushAuditLog('LOGIN', user?.name || email, 'User authenticated');
      return { user, token };
    },
    register: async (name: string, email: string, password: string) => {
      const response = await apiClient.post('/auth/register', { name, email, password });
      return response.data;
    },
    refresh: async (refreshToken: string) => {
      const response = await apiClient.post('/auth/refresh', { refreshToken });
      return response.data;
    },
    logout: async () => {
      try { await apiClient.post('/auth/logout'); } catch (_) {}
      localStorage.removeItem('token');
    },
  },

  audit: {
    pushLog: pushAuditLog,
    getAll: async () => {
      const raw = localStorage.getItem('auditLogs');
      return raw ? JSON.parse(raw) : [];
    },
  },

  users: {
    getAll: async () => {
      const response = await apiClient.get('/users');
      return response.data;
    },
    getPending: async () => {
      const response = await apiClient.get('/users/pending');
      return response.data;
    },
    getMyProfile: async () => {
      const response = await apiClient.get('/users/my-profile');
      return response.data;
    },
    updateMyProfile: async (data: { name?: string; email?: string }) => {
      const response = await apiClient.put('/users/my-profile', data);
      return response.data;
    },
    changePassword: async (oldPassword: string, newPassword: string) => {
      const response = await apiClient.put('/users/my-profile/password', { oldPassword, newPassword });
      return response.data;
    },
    getById: async (id: number) => {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    },
    create: async (data: { name: string; email: string; password: string; role: string }) => {
      const response = await apiClient.post('/users', data);
      return response.data;
    },
    update: async (id: number, data: { name?: string; role?: string; status?: string }) => {
      const response = await apiClient.put(`/users/${id}`, data);
      return response.data;
    },
    delete: async (id: number) => {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    },
    approve: async (id: number) => {
      const response = await apiClient.put(`/users/${id}/approve`);
      return response.data;
    },
    reject: async (id: number) => {
      const response = await apiClient.put(`/users/${id}/reject`);
      return response.data;
    },
  },

  products: {
    getAll: async (params?: { category?: string; status?: string; search?: string }) => {
      const response = await apiClient.get('/products', { params });
      return response.data;
    },
    getById: async (id: any) => {
      const { data: product } = await apiClient.get(`/products/${id}`);
      try {
        const { data: batches } = await apiClient.get(`/products/${id}/batches`);
        product.batches = batches;
      } catch (err) {
        product.batches = [];
      }
      return product;
    },
    create: async (data: {
      sku: string;
      name: string;
      category: string;
      supplierID: number;
      description?: string;
      price?: number;
      lowStockThreshold?: number;
    }) => {
      const response = await apiClient.post('/products', data);
      return response.data;
    },
    update: async (id: number, data: {
      name?: string;
      category?: string;
      description?: string;
      price?: number;
      lowStockThreshold?: number;
      supplierID?: number;
    }) => {
      const response = await apiClient.put(`/products/${id}`, data);
      return response.data;
    },
    delete: async (id: number) => {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    },
    getBatches: async (id: number) => {
      const response = await apiClient.get(`/products/${id}/batches`);
      return response.data;
    },
    addBatch: async (id: number, data: {
      lotNumber?: string;
      expiryDate: string;
      quantity: number;
      receivedDate: string;
    }) => {
      const response = await apiClient.post(`/products/${id}/batches`, data);
      return response.data;
    },
    getStockMovements: async (id: number) => {
      const response = await apiClient.get(`/products/${id}/stock-movements`);
      return response.data;
    },
  },

  suppliers: {
    getAll: async () => {
      const response = await apiClient.get('/suppliers');
      return response.data;
    },
    getById: async (id: number) => {
      const response = await apiClient.get(`/suppliers/${id}`);
      return response.data;
    },
    create: async (data: { name: string; contact?: string; email?: string; phone?: string }) => {
      const response = await apiClient.post('/suppliers', data);
      return response.data;
    },
    update: async (id: number, data: { name?: string; contact?: string; email?: string; phone?: string; status?: string }) => {
      const response = await apiClient.put(`/suppliers/${id}`, data);
      return response.data;
    },
    delete: async (id: number) => {
      const response = await apiClient.delete(`/suppliers/${id}`);
      return response.data;
    },
    getScore: async (id: number) => {
      const response = await apiClient.get(`/suppliers/${id}/score`);
      return response.data;
    },
  },

  purchaseOrders: {
    getAll: async (params?: { status?: string; supplierID?: number }) => {
      const response = await apiClient.get('/purchase-orders', { params });
      return response.data;
    },
    getById: async (id: any) => {
      const response = await apiClient.get(`/purchase-orders/${id}`);
      return response.data;
    },
    create: async (data: { supplierID: number }) => {
      const response = await apiClient.post('/purchase-orders', data);
      return response.data;
    },
    addItem: async (id: number, data: { productID: number; orderedQuantity: number; unitPrice: number }) => {
      const response = await apiClient.post(`/purchase-orders/${id}/items`, data);
      return response.data;
    },
    approve: async (id: number) => {
      const response = await apiClient.put(`/purchase-orders/${id}/approve`);
      return response.data;
    },
    send: async (id: number) => {
      const response = await apiClient.put(`/purchase-orders/${id}/send`);
      return response.data;
    },
    receive: async (id: number, data?: any) => {
      const response = await apiClient.put(`/purchase-orders/${id}/receive`, data || {});
      return response.data;
    },
    close: async (id: number) => {
      const response = await apiClient.put(`/purchase-orders/${id}/close`);
      return response.data;
    },
    getDeliveryStatus: async (id: number) => {
      const response = await apiClient.get(`/purchase-orders/${id}/delivery-status`);
      return response.data;
    },
  },

  stockMovements: {
    create: async (data: {
      productID: number;
      type: string;
      quantity: number;
      reason?: string;
    }) => {
      const response = await apiClient.post('/stock-movements', data);
      return response.data;
    },
  },

  companies: {
    getAll: async () => {
      const response = await apiClient.get('/companies');
      return response.data;
    },
    create: async (data: { name: string }) => {
      const response = await apiClient.post('/companies', data);
      return response.data;
    },
  },

  fefo: {
    getAlerts: async () => {
      // Mock FEFO alerts
      return [
        { id: 1, productName: 'Surgical Gloves XL', sku: 'SGL-XL-001', lotNumber: 'L-2025-01', quantity: 500, expiryDate: '2026-10-15', daysLeft: 180 },
        { id: 2, productName: 'Paracetamol 500mg', sku: 'PAR-500-BLI', lotNumber: 'B-8839-44', quantity: 120, expiryDate: '2026-05-10', daysLeft: 22 },
        { id: 3, productName: 'Vitamin C 1000mg', sku: 'VIT-C-1000', lotNumber: 'L-8822-11', quantity: 50, expiryDate: '2026-04-10', daysLeft: -7 },
        { id: 4, productName: 'Aspirin High Strength', sku: 'ASP-500-HS', lotNumber: 'B-7742-99', quantity: 1000, expiryDate: '2026-06-20', daysLeft: 60 }
      ];
    }
  }
};

export default api;
