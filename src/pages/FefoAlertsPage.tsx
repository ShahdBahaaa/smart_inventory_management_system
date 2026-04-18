import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Package, 
  ArrowRight,
  Loader2,
  Trash2,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import PageHeader from '@/components/common/Layout/PageHeader';
import DataTable from '@/components/common/Tables/DataTable';
import EmptyState from '@/components/common/Layout/EmptyState';
import { TableSkeleton } from '@/components/common/Feedback/Skeleton';
import api from '@/services/api';

const FefoAlertsPage = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const data = await api.fefo.getAlerts();
        setAlerts(data);
      } catch (err) {
        console.error('Failed to fetch FEFO alerts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const columns = [
    { 
      key: 'productName', 
      label: 'Product Node',
      render: (v: any) => (
        <div className="d-flex flex-column">
          <span className="fw-bold text-inherit">{v.productName}</span>
          <span className="small text-muted font-monospace tracking-tighter text-uppercase" style={{ fontSize: '10px' }}>SKU: {v.sku}</span>
        </div>
      )
    },
    { key: 'lotNumber', label: 'Batch ID', render: (v: any) => <span className="font-mono text-[#00BFFF] text-xs">{v.lotNumber}</span> },
    { key: 'quantity', label: 'Units', render: (v: any) => <span className="font-bold text-white">{v.quantity}</span> },
    { 
      key: 'expiryDate', 
      label: 'Expiry Threshold',
      render: (v: any) => (
        <div className="d-flex align-items-center gap-2">
          <Calendar size={14} className="text-muted"/>
          <span className={v.daysLeft < 0 ? 'text-danger fw-black fst-italic' : 'text-muted fw-medium'}>
            {v.expiryDate}
          </span>
        </div>
      )
    },
    { 
      key: 'daysLeft', 
      label: 'Status',
      render: (v: any) => {
        const isExp = v.daysLeft < 0;
        const isCritical = v.daysLeft < 30;
        return (
          <div className="d-flex align-items-center gap-2">
            <div className={`rounded-circle ${isExp ? 'bg-danger shadow-sm' : isCritical ? 'bg-warning shadow-sm' : 'bg-primary'}`} style={{ width: '8px', height: '8px' }} />
            <span className={`small fw-black text-uppercase tracking-widest ${isExp ? 'text-danger' : isCritical ? 'text-warning' : 'text-primary'}`} style={{ fontSize: '10px' }}>
              {isExp ? 'EXPIRED' : `${v.daysLeft} DAYS LEFT`}
            </span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Ops',
      align: 'end' as const,
      render: (v: any) => (
        <div className="d-flex justify-content-end gap-2">
           <button className="btn btn-sm btn-outline-secondary border-0 p-2">
              <Zap size={14}/>
           </button>
           <button className="btn btn-sm btn-outline-danger border-0 p-2">
              <Trash2 size={14}/>
           </button>
        </div>
      )
    }
  ];

  return (
    <div className="py-4 animate-in fade-in duration-700">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-4">
        <PageHeader 
          title="FEFO & Expiry Intelligence" 
          subtitle="First-Expiry First-Out tracking system to eliminate waste nodes"
        />
        <div className="d-none d-md-flex align-items-center gap-3 p-3 glass-card bg-danger bg-opacity-5 border-danger border-opacity-10">
           <div className="rounded-3 bg-danger bg-opacity-10 d-flex align-items-center justify-content-center text-danger" style={{ width: '40px', height: '40px' }}>
              <ShieldAlert size={20}/>
           </div>
           <div>
              <p className="small fw-bold text-danger text-uppercase tracking-widest mb-0" style={{ fontSize: '10px' }}>Active Expiry Risk</p>
              <h4 className="fs-5 fw-black text-inherit mb-0">{alerts.filter(v => v.daysLeft < 30).length} Critical Nodes</h4>
           </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
         {[
           { label: 'Critical Risk', val: alerts.filter(v => v.daysLeft < 30 && v.daysLeft >= 0).length, icon: <AlertTriangle size={18}/>, color: 'text-warning' },
           { label: 'Expired Items', val: alerts.filter(v => v.daysLeft < 0).length, icon: <ShieldAlert size={18}/>, color: 'text-danger' },
           { label: 'Upcoming (90d)', val: alerts.filter(v => v.daysLeft >= 30 && v.daysLeft < 90).length, icon: <Clock size={18}/>, color: 'text-primary' },
           { label: 'Safe Inventory', val: alerts.filter(v => v.daysLeft >= 90).length, icon: <Package size={18}/>, color: 'text-muted' },
         ].map(stat => (
           <div key={stat.label} className="col-12 col-md-6 col-lg-3">
             <div className="glass-card p-4 d-flex align-items-center justify-content-between border-bottom border-2 border-light-subtle h-100">
                <div>
                   <p className="small fw-bold text-muted text-uppercase tracking-widest mb-1" style={{ fontSize: '10px' }}>{stat.label}</p>
                   <h4 className={`fs-3 fw-black mb-0 ${stat.color}`}>{stat.val}</h4>
                </div>
                <div className={`rounded-3 bg-light-subtle d-flex align-items-center justify-content-center border ${stat.color}`} style={{ width: '40px', height: '40px' }}>
                   {stat.icon}
                </div>
             </div>
           </div>
         ))}
      </div>

      <div className="d-grid gap-3">
        <div className="d-flex align-items-center justify-content-between px-2">
           <div className="d-flex align-items-center gap-2">
              <Clock size={18} className="text-primary"/>
              <h2 className="fs-5 fw-bold text-inherit tracking-tight fst-italic text-uppercase mb-0">Expiry Timeline Analysis</h2>
           </div>
           <button className="btn btn-link text-primary small fw-black text-uppercase tracking-widest p-0 text-decoration-none shadow-none" style={{ fontSize: '10px' }}>
              Download Risk Report <ArrowRight size={12}/>
           </button>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : alerts.length > 0 ? (
          <DataTable columns={columns} data={alerts} />
        ) : (
          <EmptyState 
            icon={<Zap size={48}/>}
            title="Registry Healthy" 
            description="No immediate expiry risks detected in the active warehouse nodes."
          />
        )}
      </div>
    </div>
  );
};

export default FefoAlertsPage;
