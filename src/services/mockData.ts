import { PurchaseOrder, Recommendation, ForecastData, EOQData } from '@/types/index';

export const mockPOs: PurchaseOrder[] = [
  {
    id: 'PO-1001',
    productName: 'High-End Processor',
    sku: 'HE-PRO-01',
    quantity: 50,
    unitPrice: 200,
    totalAmount: 10000,
    supplier: 'Global Tech Solutions',
    status: 'SENT',
    orderDate: '2024-03-01',
    expectedDelivery: '2024-03-10',
    assignedTo: 'Admin User'
  },
  {
    id: 'PO-1002',
    productName: 'Ergonomic Chair',
    sku: 'ERG-CH-02',
    quantity: 2,
    unitPrice: 225.25,
    totalAmount: 450.50,
    supplier: 'Office Supplies Co.',
    status: 'DRAFT',
    orderDate: '2024-03-05',
    expectedDelivery: '2024-03-15',
    assignedTo: 'Admin User'
  },
  {
    id: 'PO-1003',
    productName: 'Shipping Pallets',
    sku: 'SHP-PAL-100',
    quantity: 100,
    unitPrice: 32,
    totalAmount: 3200,
    supplier: 'Logistics Pro',
    status: 'RECEIVED',
    orderDate: '2024-02-20',
    expectedDelivery: '2024-02-25',
    assignedTo: 'Admin User'
  },
  {
    id: 'PO-1004',
    productName: 'Steel Rods',
    sku: 'STL-ROD-05',
    quantity: 500,
    unitPrice: 17.8,
    totalAmount: 8900,
    supplier: 'Industrial Parts Inc.',
    status: 'CLOSED',
    orderDate: '2024-02-15',
    expectedDelivery: '2024-02-22',
    assignedTo: 'Admin User'
  }
];

export const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    productName: 'Wireless Mouse M1',
    currentStock: 12,
    recommendedQty: 50,
    reason: 'Stock below safety level + high predicted demand'
  },
  {
    id: '2',
    productName: 'Mechanical Keyboard K2',
    currentStock: 5,
    recommendedQty: 20,
    reason: 'Lead time is high, order now to avoid stockout'
  },
  {
    id: '3',
    productName: 'USB-C Cable 2m',
    currentStock: 150,
    recommendedQty: 0,
    reason: 'Stock is sufficient for next 4 months'
  }
];

export const mockForecastData: ForecastData[] = [
  { month: 'Oct', historical: 400, predicted: null },
  { month: 'Nov', historical: 450, predicted: null },
  { month: 'Dec', historical: 600, predicted: null },
  { month: 'Jan', historical: 350, predicted: null },
  { month: 'Feb', historical: 380, predicted: null },
  { month: 'Mar', historical: 420, predicted: null },
  { month: 'Apr', historical: null, predicted: 450 },
  { month: 'May', historical: null, predicted: 480 },
  { month: 'Jun', historical: null, predicted: 510 }
];

export const mockEOQ: EOQData = {
  optimalOrderQty: 250,
  reorderPoint: 45,
  estimatedSavings: 1250.75
};
