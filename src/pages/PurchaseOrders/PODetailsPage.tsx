import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Truck, Calendar, DollarSign, Pill } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../shared/Layout/PageHeader';
import DataTable from '../../shared/Tables/DataTable';

const PODetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      render: (item: any) => <span className="fw-bold neon-text">${item.total.toFixed(2)}</span>
    }
  ];

  return (
    <div className="fade-in">
      <button className="btn btn-link text-info text-decoration-none p-0 mb-3 d-flex align-items-center gap-2" onClick={() => navigate('/purchase-orders')}>
        <ArrowLeft size={18} /> Back to Procurement Hub
      </button>

      <PageHeader 
        title={`Order ${po.id}`} 
        subtitle="Detailed breakdown of procurement transaction"
      />

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
                  <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">APPROVED</span>
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
