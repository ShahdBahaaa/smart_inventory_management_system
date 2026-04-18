import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  AlertTriangle, 
  Users, 
  ShieldAlert, 
  TrendingUp, 
  BrainCircuit, 
  Lightbulb,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import PageHeader from '@/components/common/Layout/PageHeader';
import StatCard from '@/components/common/StatCard';
import api from '@/services/api';
import { Link } from 'react-router-dom';

const chartData = [
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
    { label: 'Inventory Value', value: '$1.2M', icon: <Zap />, color: 'info', trend: '+12.5%' },
    { label: 'System Efficiency', value: '98.2%', icon: <Activity />, color: 'success', trend: '+2.1%' },
    { label: 'Risk Exposure', value: lowStockMeds.length.toString().padStart(2, '0'), icon: <ShieldAlert />, color: 'danger', trend: '-5.4%' },
    { label: 'Market Nodes', value: '142', icon: <Users />, color: 'primary', trend: '+4' },
  ];

  const smartInsights = [
    { 
      type: 'OPTIMIZATION', 
      title: 'Discount Strategy Required', 
      desc: '3 Overstocked Items in Category A detected. 15% liquidations suggested.',
      icon: <BrainCircuit size={18} className="text-[#00BFFF]" />,
      action: 'Run Optimizer',
      link: '/dashboard/ai-optimizer'
    },
    { 
      type: 'RISK', 
      title: 'Batch Expiry Warning', 
      desc: 'Lot B-8839-44 (Paracetamol) expires in 22 days. Priority distribution advised.',
      icon: <AlertTriangle size={18} className="text-yellow-500" />,
      action: 'View FEFO',
      link: '/dashboard/fefo'
    },
    { 
      type: 'DEMAND', 
      title: 'Smart Reorder Opportunity', 
      desc: 'Demand for Vitamin C is trending +40%. Bulk reorder saves 12% in procurement.',
      icon: <Lightbulb size={18} className="text-green-500" />,
      action: 'Open PO Hub',
      link: '/dashboard/purchase-orders'
    }
  ];

  return (
    <div className="py-4 animate-in fade-in duration-1000">
      <PageHeader
        title="Predictive Intelligence"
        subtitle="Nexus Core AI-driven inventory analytics and neural forecasting"
      />

      <div className="row g-4 mb-5">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3">
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="row g-4 mb-5">
        {/* Smart Insights Panel */}
        <div className="col-lg-4">
          <div className="d-grid gap-4">
            <div className="d-flex align-items-center justify-content-between px-2">
               <h2 className="small fw-black text-inherit text-uppercase tracking-widest d-flex align-items-center gap-2 m-0">
                  <BrainCircuit size={16} className="text-primary"/> Smart Insights
               </h2>
               <span className="small fw-bold text-muted fst-italic" style={{ fontSize: '10px' }}>LIVE FEED</span>
            </div>
            
            <div className="d-grid gap-3">
               {smartInsights.map((insight, i) => (
                 <div key={i} className="glass-card p-3 p-lg-4 border-start border-3 border-transparent hover-border-primary cursor-pointer transition-all">
                    <div className="d-flex gap-3">
                       <div className="rounded-3 bg-light-subtle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                          {insight.icon}
                       </div>
                       <div className="flex-grow-1 min-width-0">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                             <span className="small fw-black tracking-widest text-primary text-uppercase" style={{ fontSize: '9px' }}>{insight.type}</span>
                             <Link to={insight.link} className="small fw-bold text-muted text-decoration-none hover-text-main d-flex align-items-center gap-1" style={{ fontSize: '9px' }}>
                                {insight.action} <ArrowRight size={10}/>
                             </Link>
                          </div>
                          <h4 className="small fw-bold text-inherit mb-1 tracking-tight" style={{ fontSize: '13px' }}>{insight.title}</h4>
                          <p className="small text-muted mb-0 text-truncate" style={{ fontSize: '12px' }}>{insight.desc}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Forecasting Chart */}
        <div className="col-lg-8">
          <div className="glass-card p-4 p-lg-5 h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.2)' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
               <h3 className="small fw-black text-inherit text-uppercase tracking-widest d-flex align-items-center gap-2 m-0">
                  <TrendingUp size={16} className="text-primary"/> Neural Stock Forecasting
               </h3>
               <div className="d-flex gap-3">
                  <div className="d-flex align-items-center gap-2">
                     <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px' }} />
                     <span className="small fw-bold text-muted text-uppercase tracking-widest" style={{ fontSize: '9px' }}>Projected</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                     <div className="rounded-circle bg-secondary bg-opacity-25" style={{ width: '8px', height: '8px' }} />
                     <span className="small fw-bold text-muted text-uppercase tracking-widest" style={{ fontSize: '9px' }}>Historical</span>
                  </div>
               </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00BFFF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00BFFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#475569', fontSize: 10, fontWeight: 700}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#475569', fontSize: 10, fontWeight: 700}}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(3, 7, 18, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px' 
                    }}
                    itemStyle={{ color: '#00BFFF', fontSize: 12, fontWeight: 800 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="stock" 
                    stroke="#00BFFF" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorStock)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Stock Overlay (Only if active) */}
      {lowStockMeds.length > 0 && (
        <div className="glass-card p-4 p-lg-5 border-start border-5 border-danger position-relative overflow-hidden mb-5" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
          <div className="position-absolute rotate-12 opacity-10" style={{ right: '-30px', top: '-30px' }}>
             <ShieldAlert size={150} />
          </div>
          <div className="d-flex flex-column flex-md-row align-items-md-center gap-4 mb-4 position-relative z-1">
            <div className="rounded-3 bg-danger bg-opacity-10 d-flex align-items-center justify-center text-danger pulse-animation shadow-sm" style={{ width: '48px', height: '48px' }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <h5 className="fs-5 fw-black text-inherit fst-italic m-0">Critical Depletion Nodes Detected</h5>
              <p className="small fw-bold text-danger text-uppercase tracking-widest mb-0">{lowStockMeds.length} Items require immediate procurement</p>
            </div>
            <Link to="/dashboard/products" className="ms-md-auto btn btn-danger px-4 py-2 rounded-3 small fw-black text-uppercase tracking-widest shadow-sm">
              Procure All
            </Link>
          </div>
          <div className="row g-3 position-relative z-1">
            {lowStockMeds.slice(0, 3).map(med => (
              <div key={med.id} className="col-12 col-md-4">
                <div className="p-3 bg-dark rounded-3 border d-flex justify-content-between align-items-center" style={{ backgroundColor: 'rgba(3, 7, 18, 0.4)' }}>
                  <div>
                    <div className="fw-bold text-inherit small">{med.name}</div>
                    <div className="small fw-black text-muted text-uppercase tracking-tighter" style={{ fontSize: '10px' }}>SKU: {med.sku} {' • '} Stock: {med.stock}</div>
                  </div>
                  <div className="small fw-black text-danger fst-italic">-{(((med.lowStockThreshold || 50) - med.stock) / (med.lowStockThreshold || 50) * 100).toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log (Nexus Style) */}
      <div className="d-grid gap-3">
        <h3 className="small fw-black text-inherit text-uppercase tracking-widest px-2 d-flex align-items-center gap-2 m-0">
            <Activity size={16} className="text-primary"/> Core System Logs
        </h3>
        <div className="glass-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th className="px-4 py-3">Event Node</th>
                  <th className="px-4 py-3">Operation</th>
                  <th className="px-4 py-3 text-center">AI Logic</th>
                  <th className="px-4 py-3 text-end">Age</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { node: 'Node-Alpha-01', op: 'STOCK_REBALANCE', logic: 'OPTIMIZED', time: '2s ago', statusColor: 'text-success', path: '/dashboard/products' },
                  { node: 'Supplier-Nexus', op: 'PO_GEN_AUTO', logic: 'AWAITING', time: '5m ago', statusColor: 'text-primary', path: '/dashboard/suppliers' },
                  { node: 'Warehouse-Gamma', op: 'EXPIRE_SWEEPER', logic: 'COMPLETED', time: '12m ago', statusColor: 'text-info', path: '/dashboard/products' },
                  { node: 'Optimizer-Engine', op: 'MARK_DOWN_CALC', logic: 'ACTIVE', time: '1h ago', statusColor: 'text-warning', path: '/dashboard/ai-optimizer' },
                ].map((log, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <Link to={log.path} className="small fw-bold text-inherit text-decoration-none font-monospace">
                        {log.node}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-light text-muted border-0 small text-uppercase" style={{ fontSize: '9px' }}>{log.op}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`small fw-black text-uppercase tracking-widest ${log.statusColor}`} style={{ fontSize: '10px' }}>{log.logic}</span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <span className="small fw-bold text-muted">{log.time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
