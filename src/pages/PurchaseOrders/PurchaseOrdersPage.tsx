import React, { useState, useEffect } from 'react';
import { FileText, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/Layout/PageHeader';
import DataTable from '@/components/common/Tables/DataTable';
import { usePO } from '@/store/POContext';

const PurchaseOrdersPage = () => {
  const navigate = useNavigate();
  const { orders, loading } = usePO();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT': return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25">DRAFT</span>;
      case 'SENT': return <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25">SENT</span>;
      case 'APPROVED': return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">APPROVED</span>;
      case 'RECEIVED': return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">RECEIVED</span>;
      case 'CLOSED': return <span className="badge bg-secondary bg-opacity-10 text-muted border border-secondary border-opacity-25">CLOSED</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const columns = [
    { 
      key: 'id', 
      label: 'PO Number',
      render: (po: any) => (
        <div className="d-flex align-items-center gap-2">
          <FileText size={16} className="text-info" />
          <span className="fw-bold neon-text">{po.id}</span>
        </div>
      )
    },
    { key: 'supplier', label: 'Supplier' },
    { 
      key: 'status', 
      label: 'Status',
      render: (po: any) => getStatusBadge(po.status)
    },
    { key: 'date', label: 'Date', render: (po: any) => <span className="text-muted small">{po.date}</span> },
    { 
      key: 'total', 
      label: 'Total Cost',
      render: (po: any) => <span className="fw-bold">${po.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    { 
      key: 'actions', 
      label: 'Actions',
      align: 'end' as const,
      render: (po: any) => (
        <button className="btn btn-sm btn-outline-info rounded-pill px-3" onClick={() => navigate(`/dashboard/purchase-orders/${po.id}`)}>
          <Eye size={14} className="me-1" /> Details
        </button>
      )
    }
  ];

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <PageHeader 
          title="Procurement Hub" 
          subtitle="Automated purchase order management and tracking"
        />
        <button
          className="btn d-flex align-items-center gap-2 rounded-pill px-4 py-2 fw-bold transition-all"
          onClick={() => navigate('/dashboard/purchase-orders/new')}
          style={{ 
            background: '#00BFFF', 
            color: '#111827',
            border: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0, 191, 255, 0.3)'
          }}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 191, 255, 0.5)'}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 191, 255, 0.3)'}
        >
          <FileText size={20} strokeWidth={3} />
          <span>Create PO</span>
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={orders} 
        loading={loading} 
      />
    </div>
  );
};

export default PurchaseOrdersPage;
