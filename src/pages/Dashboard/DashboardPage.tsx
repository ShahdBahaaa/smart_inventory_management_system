import React, { useState, useEffect } from 'react';
import { Pill, Users, Truck, AlertTriangle, Activity, Zap, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import PageHeader from '@/components/common/Layout/PageHeader';
import StatCard from '@/components/common/StatCard';
import api from '@/services/api';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Mon', stock: 4000, orders: 2400 },
  { name: 'Tue', stock: 3000, orders: 1398 },
  { name: 'Wed', stock: 2000, orders: 9800 },
  { name: 'Thu', stock: 2780, orders: 3908 },
  { name: 'Fri', stock: 1890, orders: 4800 },
  { name: 'Sat', stock: 2390, orders: 3800 },
  { name: 'Sun', stock: 3490, orders: 4300 },
];

const DashboardPage = () => {
  const [lowStockMeds, setLowStockMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await api.products.getAll();
        const lowStock = products.filter((m: any) => m.stock < (m.lowStockThreshold || 50));
        setLowStockMeds(lowStock);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Inventory Value', value: '$1.2M', icon: <Zap />, color: 'info', trend: '+12%' },
    { label: 'AI Efficiency', value: '94%', icon: <Activity />, color: 'success', trend: '+2%' },
    { label: 'Critical Alerts', value: lowStockMeds.length.toString().padStart(2, '0'), icon: <AlertTriangle />, color: 'danger', trend: lowStockMeds.length > 0 ? `+${lowStockMeds.length}` : '0' },
    { label: 'Active Nodes', value: '12', icon: <Users />, color: 'primary', trend: '0' },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Predictive Intelligence"
        subtitle="Real-time AI-driven inventory analytics and forecasting"
      />

      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div className="col-md-6 col-lg-3" key={index}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        {lowStockMeds.length > 0 && (
          <div className="col-12">
            <div className="glass-card p-4 border-info border-opacity-20 bg-info bg-opacity-10">
              <div className="d-flex align-items-center gap-3 mb-3">
                <ShieldAlert size={24} className="text-info pulse-animation" />
                <h5 className="mb-0 fw-bold text-info">Critical Inventory Alerts</h5>
              </div>
              <div className="row g-3">
                {lowStockMeds.map(med => (
                  <div key={med.id} className="col-md-6 col-lg-4">
                    <div className="p-3 bg-white rounded-3 border border-info border-opacity-10 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-dark small">{med.name}</div>
                        <div className="text-info small fw-bold">Stock: {med.stock} (Threshold: {med.lowStockThreshold || 50})</div>
                      </div>
                      <Link to={`/dashboard/products/${med.id}`} className="btn btn-sm btn-outline-info">Restock</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="col-lg-8">
          <div className="glass-card p-4 h-100">
            <h5 className="mb-4 fw-bold neon-text d-flex align-items-center gap-2">
              <Activity size={20} /> Stock Level Forecasting
            </h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    itemStyle={{ color: '#0ea5e9' }}
                  />
                  <Area type="monotone" dataKey="stock" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorStock)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-card p-4 h-100">
            <h5 className="mb-4 fw-bold neon-text d-flex align-items-center gap-2">
              <Truck size={20} /> Fulfillment Rate
            </h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                  <Bar dataKey="orders" fill="#00BFFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-12">
          <div className="glass-card p-4">
            <h5 className="mb-4 fw-bold neon-text">System Activity Panel</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Event Source</th>
                    <th>Action</th>
                    <th>Intelligence Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-medium">Node-Alpha-01</td>
                    <td><span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25">Stock Rebalance</span></td>
                    <td className="text-success small fw-bold">OPTIMIZED</td>
                    <td className="text-muted small">0.02s ago</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">Supplier-Gateway</td>
                    <td><span className="badge bg-purple bg-opacity-10 text-purple border border-purple border-opacity-25" style={{ color: '#bc13fe', borderColor: '#bc13fe' }}>Auto-PO Generated</span></td>
                    <td className="text-info small fw-bold">PENDING APPROVAL</td>
                    <td className="text-muted small">5m ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
