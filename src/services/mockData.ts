import { PurchaseOrder, Recommendation, ForecastData, EOQData } from '@/types/index';

export const mockPOs: PurchaseOrder[] = [
  {
    id: 'PO-1001',
    supplier: 'Global Tech Solutions',
    date: '2024-03-01',
    status: 'SENT',
    total: 12500.00,
    daysOverdue: 5,
    items: [
      { id: '1', name: 'High-End Processor', orderedQty: 50, receivedQty: 0, unitPrice: 200 },
      { id: '2', name: 'Motherboard X1', orderedQty: 25, receivedQty: 0, unitPrice: 100 }
    ]
  },
  {
    id: 'PO-1002',
    supplier: 'Office Supplies Co.',
    date: '2024-03-05',
    status: 'DRAFT',
    total: 450.50,
    daysOverdue: 0,
    items: [
      { id: '3', name: 'Ergonomic Chair', orderedQty: 2, receivedQty: 0, unitPrice: 225.25 }
    ]
  },
  {
    id: 'PO-1003',
    supplier: 'Logistics Pro',
    date: '2024-02-20',
    status: 'RECEIVED',
    total: 3200.00,
    daysOverdue: 0,
    items: [
      { id: '4', name: 'Shipping Pallets', orderedQty: 100, receivedQty: 100, unitPrice: 32 }
    ]
  },
  {
    id: 'PO-1004',
    supplier: 'Industrial Parts Inc.',
    date: '2024-02-15',
    status: 'CLOSED',
    total: 8900.00,
    daysOverdue: 0,
    items: [
      { id: '5', name: 'Steel Rods', orderedQty: 500, receivedQty: 500, unitPrice: 17.8 }
    ]
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
  { month: 'Oct', historical: 400 },
  { month: 'Nov', historical: 450 },
  { month: 'Dec', historical: 600 },
  { month: 'Jan', historical: 350 },
  { month: 'Feb', historical: 380 },
  { month: 'Mar', historical: 420 },
  { month: 'Apr', predicted: 450 },
  { month: 'May', predicted: 480 },
  { month: 'Jun', predicted: 510 }
];

export const mockEOQ: EOQData = {
  optimalOrderQty: 250,
  reorderPoint: 45,
  estimatedSavings: 1250.75
};
