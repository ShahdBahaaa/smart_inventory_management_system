import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import api from '@/services/api';

export interface POContextType {
  orders: any[];
  loading: boolean;
  refreshOrders: () => Promise<void>;
  addOrder: (order: any) => void;
  updateOrderStatus: (id: string, status: string) => void;
}

export const POContext = createContext<POContextType | null>(null);

export const POProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshOrders = async () => {
    setLoading(true);
    try {
      const data = await api.purchaseOrders.getAll();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load POs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshOrders(); }, []);

  // kept for backward compatibility – use refreshOrders for real persistence
  const addOrder = (order: any) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <POContext.Provider value={{ orders, loading, refreshOrders, addOrder, updateOrderStatus }}>
      {children}
    </POContext.Provider>
  );
};

export const usePO = () => {
  const context = useContext(POContext);
  if (!context) throw new Error('usePO must be used within POProvider');
  return context;
};
