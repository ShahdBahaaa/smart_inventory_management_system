export interface ForecastData {
  month: string;
  historical: number | null;
  predicted: number | null;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    stockStatus: string;
    currentStock: number;
    minStock: number;
    unitPrice: number;
    eanCode?: string;
    description?: string;
    brand?: string;
    supplier?: string;
    lotNumber?: string;
    expiryDate?: string;
}

export interface PurchaseOrder {
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    supplier: string;
    status: string;
    orderDate: string;
    expectedDelivery: string;
    assignedTo: string;
    poNumber?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
}

export interface Supplier {
    id: string;
    name: string;
    contactName: string;
    email: string;
    phone: string;
    status: string;
    rating: number;
}

export interface POItem {
  id: string;
  name: string;
  orderedQty: number;
}

export type POStatus = 'DRAFT' | 'SENT' | 'RECEIVED' | 'CLOSED';

export interface EOQData {
  optimalOrderQty: number;
  reorderPoint: number;
  estimatedSavings: number;
}


export interface Recommendation {
  id: string;
  productName: string;
  currentStock: number;
  recommendedQty: number;
  reason: string;
}

