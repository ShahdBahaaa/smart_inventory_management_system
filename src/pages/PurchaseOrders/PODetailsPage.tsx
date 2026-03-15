import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Truck, Calendar, DollarSign, Pill, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import PageHeader from '@/components/common/Layout/PageHeader';
import DataTable from '@/components/common/Tables/DataTable';

const PODetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Example role check: only Manager/Admin can approve
  const canApprove = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'System Administrator';

  useEffect(() => {
    const fetchPO = async () => {
      try {
        const data = await api.purchaseOrders.getById(id!);
        setPo(data);
      } catch (error) {
        console.error('Failed to fetch PO details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPO();
  }, [id]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-info" role="status"></div></div>;
  if (!po) return <div className="alert alert-danger">Purchase Order not found</div>;

  const columns = [
    { 
      key: 'medicine', 
      label: 'Medicine',
      render: (item: any) => (
        <div className="d-flex align-items-center gap-2">
          <Pill size={14} className="text-primary" />
          <span>{item.medicine}</span>
        </div>
      )
    },
    { key: 'quantity', label: 'Quantity', align: 'center' as const },
    { 
      key: 'price', 
      label: 'Unit Price', 
      align: 'end' as const,
      render: (item: any) => `$${item.price.toFixed(2)}`
    },
    { 
      key: 'total', 
      label: 'Total', 
      align: 'end' as const,
      render: (item: any) => <span className="fw-bold neon-text">${(item.total || (item.price * item.quantity) || 0).toFixed(2)}</span>
    }
  ];

  const timelineSteps = ['DRAFT', 'SENT', 'RECEIVED', 'CLOSED'];
  const currentStepIndex = timelineSteps.indexOf(po.status || 'DRAFT');

  return (
    <div className="fade-in">
      <button className="btn btn-link text-info text-decoration-none p-0 mb-3 d-flex align-items-center gap-2" onClick={() => navigate('/dashboard/purchase-orders')}>
        <ArrowLeft size={18} /> Back to Procurement Hub
      </button>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <PageHeader 
          title={`Order ${po.id}`} 
          subtitle="Detailed breakdown of procurement transaction"
        />
        {po.status === 'DRAFT' && canApprove && (
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger d-flex align-items-center gap-2 bg-white"><X size={16}/> Reject PO</button>
            <button className="btn btn-success d-flex align-items-center gap-2 shadow-sm"><Check size={16}/> Approve PO</button>
          </div>
        )}
      </div>

      <div className="glass-card mb-4 p-4 border-0 rounded-4">
        <h5 className="mb-4 fw-bold text-dark">Order Status Timeline</h5>
        <div className="d-flex justify-content-between text-center position-relative">
          <div className="position-absolute w-100" style={{ top: '24px', left: 0, height: '4px', background: '#e9ecef', zIndex: 0 }}></div>
          <div className="position-absolute" style={{ top: '24px', left: 0, height: '4px', background: '#0ea5e9', zIndex: 0, width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
          
          {timelineSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            return (
              <div key={step} className="position-relative" style={{ zIndex: 1, width: '120px' }}>
                <div 
                  className={`mx-auto rounded-circle d-flex align-items-center justify-content-center border-0 mb-2 ${isCompleted ? 'bg-info text-white shadow-glow' : 'bg-light text-muted border border-secondary border-opacity-25'}`}
                  style={{ width: '48px', height: '48px', backgroundColor: isCompleted ? '#0ea5e9' : '' }}
                >
                  {isCompleted ? <Check size={24} /> : <div style={{width:'12px', height:'12px', borderRadius:'50%', background:'#ccc'}}/>}
                </div>
                <div className={`small fw-bold ${isCurrent ? 'text-info' : isCompleted ? 'text-dark' : 'text-muted'}`}>{step}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="glass-card p-4 h-100">
            <h5 className="mb-4 fw-bold neon-text d-flex align-items-center gap-2">
              <Truck size={20} /> Supplier Information
            </h5>
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="text-muted small text-uppercase tracking-wider d-block mb-1">Supplier Name</label>
                <div className="fw-bold fs-5">{po.supplier.name}</div>
              </div>
              <div className="row">
                <div className="col-6">
                  <label className="text-muted small text-uppercase tracking-wider d-block mb-1">Contact</label>
                  <div>{po.supplier.contact}</div>
                </div>
                <div className="col-6">
                  <label className="text-muted small text-uppercase tracking-wider d-block mb-1">Email</label>
                  <div className="text-info small">{po.supplier.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="glass-card p-4 h-100">
            <h5 className="mb-4 fw-bold neon-text d-flex align-items-center gap-2">
              <FileText size={20} /> Transaction Summary
            </h5>
            <div className="row g-3">
              <div className="col-6">
                <div className="p-3 bg-dark bg-opacity-25 rounded-3 border border-secondary border-opacity-10">
                  <label className="text-muted small text-uppercase tracking-wider d-block mb-1">Date</label>
                  <div className="fw-bold">2026-03-01</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-dark bg-opacity-25 rounded-3 border border-secondary border-opacity-10">
                  <label className="text-muted small text-uppercase tracking-wider d-block mb-1">Status</label>
                  <span className={`badge ${po.status === 'DRAFT' ? 'bg-warning text-dark' : 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25'}`}>{po.status || 'DRAFT'}</span>
                </div>
              </div>
              <div className="col-12">
                <div className="p-3 bg-info bg-opacity-10 rounded-3 border border-info border-opacity-25 d-flex justify-content-between align-items-center">
                  <label className="text-info small text-uppercase tracking-wider fw-bold mb-0">Total Transaction Value</label>
                  <div className="fw-bold fs-4 neon-text">$12,500.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h5 className="mb-3 fw-bold neon-text">Ordered Medicines</h5>
      <DataTable columns={columns} data={po.items} />
    </div>
  );
};

export default PODetailsPage;
