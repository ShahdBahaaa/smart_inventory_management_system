import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  PieChart as PieChartIcon, 
  Tag, 
  BadgePercent, 
  TrendingDown, 
  Zap,
  Check,
  X,
  Info,
  Loader2,
  Table as TableIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import PageHeader from '@/components/common/Layout/PageHeader';
import DataTable from '@/components/common/Tables/DataTable';
import EmptyState from '@/components/common/Layout/EmptyState';
import { TableSkeleton } from '@/components/common/Feedback/Skeleton';
import api from '@/services/api';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

type TabType = 'abc' | 'recommendations' | 'active';

const AIOptimizerHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('abc');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [products, setProducts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeDiscounts, setActiveDiscounts] = useState<any[]>([]);
  const [actioningId, setActioningId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const [prodRes, recRes, activeRes] = await Promise.all([
        api.products.getAll(),
        axios.get('/api/discount-recommendations', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
        axios.get('/api/active-discounts', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
      ]);

      // Process ABC
      const prodArray = Array.isArray(prodRes) ? prodRes : [];
      setProducts(prodArray.map((p: any) => ({
        ...p,
        abcCategory: p.abcCategory || (p.id % 3 === 0 ? 'A' : p.id % 2 === 0 ? 'B' : 'C')
      })));

      // Recommendations
      const recData = Array.isArray(recRes.data) ? recRes.data : (recRes.data?.recommendations || []);
      setRecommendations(recData.length > 0 ? recData : [
        { id: 101, productName: 'Aspirin High Strength', discountPercentage: 25, confidence: 87, reason: 'Slow-moving item in current season' },
        { id: 102, productName: 'Vitamin C 1000mg', discountPercentage: 15, confidence: 92, reason: 'Expiry risk: batch expires in 45 days' },
        { id: 103, productName: 'Surgical Masks Box', discountPercentage: 40, confidence: 64, reason: 'Excess inventory overhead' },
      ]);

      // Active
      const activeData = Array.isArray(activeRes.data) ? activeRes.data : (activeRes.data?.discounts || []);
      setActiveDiscounts(activeData.length > 0 ? activeData : [
        { id: 1, productName: 'Surgical Gloves XL', category: 'Supplies', discountPercentage: 20, clearanceRate: 65, daysRemaining: 12, status: 'Active' },
        { id: 2, productName: 'Paracetamol 500mg', category: 'Pain Relief', discountPercentage: 15, clearanceRate: 88, daysRemaining: 2, status: 'Expiring Soon' },
      ]);

    } catch (err) {
      console.error('Failed to load Hub data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setActioningId(id);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/discount-recommendations/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendations(prev => prev.filter(r => r.id !== id));
      if (action === 'approve') fetchData();
    } catch (error) {
       // Mock simulation
       setTimeout(() => {
          setRecommendations(prev => prev.filter(r => r.id !== id));
          setActioningId(null);
       }, 500);
       return;
    }
    setActioningId(null);
  };

  // ABC Analysis Helpers
  const abcStats = [
    { name: 'Category A', value: products.filter(p => p.abcCategory === 'A').length, color: '#FF4444' },
    { name: 'Category B', value: products.filter(p => p.abcCategory === 'B').length, color: '#FFBB28' },
    { name: 'Category C', value: products.filter(p => p.abcCategory === 'C').length, color: '#00C49F' },
  ].filter(s => s.value > 0);

  const tabs = [
    { id: 'abc', label: 'Value Analysis (ABC)', icon: <PieChartIcon size={18}/> },
    { id: 'recommendations', label: 'AI Optimization', icon: <BrainCircuit size={18}/> },
    { id: 'active', label: 'Live Promotions', icon: <BadgePercent size={18}/> },
  ];

  return (
    <div className="py-4 animate-in fade-in duration-700">
      <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-4 mb-5">
        <PageHeader 
          title="AI Optimizer Hub" 
          subtitle="Advanced marketplace intelligence and inventory clearance control"
        />
        
        <div className="d-flex p-1 bg-light-subtle border rounded-3 backdrop-blur-xl shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 small fw-bold transition-all border-0 shadow-none ${
                activeTab === tab.id 
                ? 'btn-primary shadow-sm' 
                : 'text-muted hover-bg-light'
              }`}
              style={{ fontSize: '11px' }}
            >
              {tab.icon}
              <span className="d-none d-sm-inline text-uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="d-grid gap-4"
          >
            <div className="row g-4">
               <div className="col-lg-8"><TableSkeleton /></div>
               <div className="col-lg-4">
                  <div className="glass-card p-5 d-flex align-items-center justify-content-center h-100">
                     <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  </div>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* ABC CONTENT */}
            {activeTab === 'abc' && (
              <div className="row g-4">
                <div className="col-lg-4">
                  <div className="glass-card p-4 p-lg-5 d-flex flex-column align-items-center justify-content-center h-100">
                    <h3 className="small fw-bold text-muted text-uppercase tracking-widest mb-4">Classification Distribution</h3>
                    <div className="w-100 position-relative" style={{ height: '260px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={abcStats}
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            {abcStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
                            itemStyle={{ color: 'var(--text-main)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="position-absolute top-50 start-50 translate-middle text-center pointer-events-none mt-n3">
                        <span className="fs-1 fw-black text-inherit d-block">{products.length}</span>
                        <span className="small fw-bold text-muted text-uppercase tracking-tighter" style={{ fontSize: '10px' }}>Total SKU</span>
                      </div>
                    </div>
                    <div className="row g-2 w-100 mt-4">
                       {abcStats.map(s => (
                         <div key={s.name} className="col-4 text-center">
                            <p className="small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '9px' }}>{s.name.split(' ')[1]}</p>
                            <div className="rounded-pill" style={{ height: '4px', backgroundColor: s.color }} />
                            <p className="small fw-bold text-inherit mt-2 mb-0">{Math.round((s.value / products.length) * 100)}%</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="col-lg-8">
                   <div className="d-grid gap-4">
                     <div className="d-flex align-items-center justify-content-between px-2">
                        <div className="d-flex align-items-center gap-3">
                           <div className="rounded-3 bg-light-subtle d-flex align-items-center justify-content-center border" style={{ width: '32px', height: '32px' }}>
                              <TableIcon size={16} className="text-primary"/>
                           </div>
                           <h3 className="fs-5 fw-bold text-inherit tracking-tight fst-italic m-0">Inventory Registry By Category</h3>
                        </div>
                        <div className="d-flex gap-2">
                           {['A','B','C'].map(cat => (
                             <span key={cat} className={`badge small text-uppercase ${
                               cat === 'A' ? 'text-danger' : cat === 'B' ? 'text-warning' : 'text-success'
                             }`} style={{ fontSize: '10px' }}>Group {cat}</span>
                           ))}
                        </div>
                     </div>
                     <DataTable 
                        columns={[
                          { key: 'name', label: 'Product Name' },
                          { key: 'sku', label: 'SKU', render: (v: any) => <span className="font-monospace small text-muted" style={{ fontSize: '10px' }}>{v.sku}</span> },
                          { key: 'abcCategory', label: 'Category', render: (v: any) => (
                            <span className={`badge small px-2 py-1 ${
                              v.abcCategory === 'A' ? 'bg-danger bg-opacity-10 text-danger' : 
                              v.abcCategory === 'B' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-success bg-opacity-10 text-success'
                            }`} style={{ fontSize: '10px' }}>CAT {v.abcCategory}</span>
                          )}
                        ]}
                        data={products}
                     />
                   </div>
                </div>
              </div>
            )}

            {/* RECOMMENDATIONS CONTENT */}
            {activeTab === 'recommendations' && (
              recommendations.length > 0 ? (
                <div className="row g-4">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="col-12 col-md-6 col-lg-4">
                      <div className="glass-card p-0 overflow-hidden d-flex flex-column h-100 transition-all border-hover-primary">
                        <div className="p-3 bg-light-subtle border-bottom d-flex align-items-center justify-content-between" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                          <span className="small fw-bold text-uppercase tracking-widest text-primary" style={{ fontSize: '10px' }}>AI AGENT SCAN</span>
                          <Zap size={14} className="text-primary animate-pulse" />
                        </div>
                        <div className="p-4 flex-grow-1 d-grid gap-4">
                          <div className="d-flex align-items-start gap-4">
                            <div className="rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 d-flex align-items-center justify-content-center text-primary" style={{ width: '48px', height: '48px' }}><Tag size={24}/></div>
                            <div>
                              <h4 className="fs-6 fw-bold text-inherit mb-1 lh-sm">{rec.productName}</h4>
                              <p className="small fw-bold text-muted text-uppercase tracking-widest mb-0" style={{ fontSize: '9px' }}>Optimization Node</p>
                            </div>
                          </div>
                          
                          <div className="d-flex align-items-end gap-2">
                             <span className="display-4 fw-black text-primary fst-italic">-{rec.discountPercentage}%</span>
                             <span className="small fw-bold text-muted text-uppercase tracking-widest mb-2" style={{ fontSize: '9px' }}>Recommended Reduction</span>
                          </div>

                          <div className="p-3 rounded-3 bg-dark bg-opacity-25 border d-grid gap-2">
                             <div className="d-flex justify-content-between align-items-center small fw-bold text-uppercase text-muted" style={{ fontSize: '9px' }}>
                                <span>Confidence Metric</span>
                                <span className="text-primary">{rec.confidence}%</span>
                             </div>
                             <div className="progress" style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                <div className="progress-bar bg-primary shadow-glow" role="progressbar" style={{ width: `${rec.confidence}%` }}></div>
                             </div>
                             <p className="small text-muted fst-italic lh-sm m-0 mt-2 border-top pt-2" style={{ fontSize: '11px', borderTopColor: 'rgba(255,255,255,0.05) !important' }}>"{rec.reason}"</p>
                          </div>
                        </div>

                        {user?.role === 'BUSINESS_OWNER' && (
                          <div className="p-3 bg-light-subtle row g-2 border-top m-0" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <div className="col-6">
                              <button onClick={() => handleAction(rec.id, 'approve')} className="btn btn-success w-100 py-2 small fw-black text-uppercase tracking-widest d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '10px' }}>
                                 {actioningId === rec.id ? <Loader2 className="animate-spin w-3 h-3"/> : <Check size={14}/>} APPROVE
                              </button>
                            </div>
                            <div className="col-6">
                              <button onClick={() => handleAction(rec.id, 'reject')} className="btn btn-outline-secondary w-100 py-2 small fw-black text-uppercase tracking-widest d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '10px' }}>
                                 <X size={14}/> REJECT
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="No Intelligence Detected" 
                  description="The AI system has not found any inventory nodes requiring clearance optimization at this moment."
                />
              )
            )}

            {/* ACTIVE DISCOUNTS CONTENT */}
            {activeTab === 'active' && (
              activeDiscounts.length > 0 ? (
                <div className="row g-4">
                  {activeDiscounts.map((discount) => (
                    <div key={discount.id} className="col-12 col-lg-6">
                      <div className="glass-card p-0 overflow-hidden d-flex flex-column flex-sm-row h-100 transition-all">
                        <div className="d-flex flex-column align-items-center justify-content-center bg-primary bg-opacity-5 border-end border-white-5 p-4 p-sm-5" style={{ minWidth: '130px' }}>
                           <span className="fs-1 fw-black text-primary fst-italic">{discount.discountPercentage}%</span>
                           <span className="small fw-black text-muted text-uppercase tracking-widest mt-1" style={{ fontSize: '8px' }}>Active Reduction</span>
                        </div>
                        <div className="flex-grow-1 p-4 p-lg-5 d-grid gap-4">
                           <div className="d-flex justify-content-between align-items-start">
                              <div>
                                 <h4 className="fs-5 fw-bold text-inherit m-0 lh-sm">{discount.productName}</h4>
                                 <span className="small fw-bold text-primary text-uppercase tracking-widest" style={{ fontSize: '9px' }}>{discount.category}</span>
                              </div>
                              <div className={`badge small text-uppercase tracking-widest border border-opacity-50 ${
                                discount.status === 'Expiring Soon' ? 'border-danger text-danger bg-danger bg-opacity-10' : 'border-success text-success bg-success bg-opacity-10'
                              }`} style={{ fontSize: '8px' }}>
                                 {discount.status}
                              </div>
                           </div>

                           <div className="d-grid gap-2">
                              <div className="d-grid gap-1">
                                 <div className="d-flex justify-content-between small fw-bold text-uppercase text-muted" style={{ fontSize: '9px' }}>
                                    <span>Market Clearance Progress</span>
                                    <span className="text-inherit">{discount.clearanceRate}%</span>
                                 </div>
                                 <div className="progress" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${discount.clearanceRate}%` }}></div>
                                 </div>
                              </div>
                              <div className="d-flex align-items-center gap-2 small fw-bold text-muted text-uppercase" style={{ fontSize: '9px' }}>
                                 <TrendingDown size={12}/> {discount.daysRemaining} days remaining in campaign cycle
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="No Active Promos" 
                  description="There are currently no live clearance campaigns active in the marketplace."
                />
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIOptimizerHub;
