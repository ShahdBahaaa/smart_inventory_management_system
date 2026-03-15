import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import api from '@/services/api';

export interface POContextType {
  orders: any[];
  addOrder: (order: any) => void;
  updateOrderStatus: (id: string, status: string) => void;
  loading: boolean;
}

export const POContext = createContext<POContextType | null>(null);

export const POProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.purchaseOrders.getAll()
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load POs", err);
        setLoading(false);
      });
  }, []);

  const addOrder = (order: any) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <POContext.Provider value={{ orders, addOrder, updateOrderStatus, loading }}>
      {children}
    </POContext.Provider>
  );
};

export const usePO = () => {
  const context = useContext(POContext);
  if (!context) throw new Error("usePO must be used within POProvider");
  return context;
};
