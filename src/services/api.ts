import axios from 'axios';

// Mock Data
const mockData = {
  users: [
    { id: 1, name: 'Dr. Sarah Chen', email: 's.chen@smartpharma.ai', role: 'ADMIN', status: 'ACTIVE' },
    { id: 2, name: 'Marcus Vane', email: 'm.vane@smartpharma.ai', role: 'INVENTORY_MANAGER', status: 'ACTIVE' },
    { id: 3, name: 'Elena Rodriguez', email: 'e.rod@smartpharma.ai', role: 'WAREHOUSE_STAFF', status: 'ACTIVE' },
    { id: 4, name: 'James Wilson', email: 'j.wilson@smartpharma.ai', role: 'WAREHOUSE_STAFF', status: 'INACTIVE' },
  ],
  products: [
    { id: 1, name: 'Amoxicillin 500mg', sku: 'AMX-500', category: 'Antibiotics', supplier: 'Global Pharma', stock: 1240, expiryStatus: 'VALID', lowStockThreshold: 100 },
    { id: 2, name: 'Paracetamol 500mg', sku: 'PAR-500', category: 'Analgesics', supplier: 'MedLife Inc', stock: 5400, expiryStatus: 'VALID', lowStockThreshold: 500 },
    { id: 3, name: 'Insulin Glargine', sku: 'INS-GLA', category: 'Antidiabetics', supplier: 'Global Pharma', stock: 45, expiryStatus: 'EXPIRING_SOON', lowStockThreshold: 50 },
    { id: 4, name: 'Atorvastatin 20mg', sku: 'ATR-20', category: 'Statins', supplier: 'HealthCorp', stock: 0, expiryStatus: 'EXPIRED', lowStockThreshold: 200 },
    { id: 5, name: 'Lisinopril 10mg', sku: 'LIS-010', category: 'ACE Inhibitors', supplier: 'MedLife Inc', stock: 890, expiryStatus: 'VALID', lowStockThreshold: 100 },
  ],
  suppliers: [
    { id: 1, name: 'Global Pharma Solutions', contact: 'John Doe', phone: '+1 234 567 890', email: 'orders@globalpharma.ai', score: 98 },
    { id: 2, name: 'MedLife Industries', contact: 'Jane Smith', phone: '+1 987 654 321', email: 'supply@medlife.io', score: 92 },
    { id: 3, name: 'HealthCorp Bio', contact: 'Bob Wilson', phone: '+1 112 233 445', email: 'logistics@healthcorp.com', score: 85 },
  ],
  purchaseOrders: [
    { id: 'PO-2026-001', supplier: 'Global Pharma Solutions', status: 'APPROVED', date: '2026-03-01', total: 12500.00 },
    { id: 'PO-2026-002', supplier: 'MedLife Industries', status: 'SENT', date: '2026-03-05', total: 8400.50 },
    { id: 'PO-2026-003', supplier: 'HealthCorp Bio', status: 'RECEIVED', date: '2026-02-20', total: 3200.00 },
    { id: 'PO-2026-004', supplier: 'Global Pharma Solutions', status: 'DRAFT', date: '2026-03-08', total: 1500.00 },
    { id: 'PO-2026-005', supplier: 'MedLife Industries', status: 'CLOSED', date: '2026-01-15', total: 22000.00 },
  ],
  poDetails: {
    'PO-2026-001': {
      id: 'PO-2026-001',
      supplier: { name: 'Global Pharma Solutions', contact: 'John Doe', email: 'orders@globalpharma.ai' },
      items: [
        { product: 'Amoxicillin 500mg', quantity: 500, price: 15.00, total: 7500.00 },
        { product: 'Lisinopril 10mg', quantity: 250, price: 20.00, total: 5000.00 },
      ]
    }
  },
  batches: [
    { id: 1, productId: 1, lotNumber: 'LOT-A12', expiryDate: '2027-12-31', quantity: 800, status: 'ACTIVE' },
    { id: 2, productId: 1, lotNumber: 'LOT-B45', expiryDate: '2026-06-30', quantity: 440, status: 'ACTIVE' },
    { id: 3, productId: 3, lotNumber: 'LOT-C78', expiryDate: '2026-03-15', quantity: 20, status: 'ACTIVE' },
    { id: 4, productId: 3, lotNumber: 'LOT-D90', expiryDate: '2026-04-10', quantity: 25, status: 'ACTIVE' },
    { id: 5, productId: 4, lotNumber: 'LOT-E11', expiryDate: '2025-12-01', quantity: 0, status: 'EXPIRED' },
  ]
};

// Mock API Service
const api = {
  auth: {
    login: async (email, password) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (email === 'admin@pharma.com' && password === 'password') {
        return { user: mockData.users[0], token: 'mock-jwt-token' };
      }
      throw new Error('Invalid credentials');
    },
    register: async (name, email, password) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Just mock successful registration
      return { success: true };
    }
  },
  users: {
    getAll: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData.users;
    }
  },
  products: {
    getAll: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData.products;
    },
    getById: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const product = mockData.products.find(m => m.id === parseInt(id));
      const batches = mockData.batches.filter(b => b.productId === parseInt(id));
      return { ...product, batches };
    }
  },
  suppliers: {
    getAll: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData.suppliers;
    }
  },
  purchaseOrders: {
    getAll: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData.purchaseOrders;
    },
    getById: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData.poDetails[id] || mockData.poDetails['PO-2026-001'];
    }
  }
};

export default api;
