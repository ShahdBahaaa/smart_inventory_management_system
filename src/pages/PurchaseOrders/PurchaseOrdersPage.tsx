import React, { useState, useEffect } from 'react';
import { FileText, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PageHeader from '../../shared/Layout/PageHeader';
import DataTable from '../../shared/Tables/DataTable';

const PurchaseOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.purchaseOrders.getAll();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch POs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
        <button className="btn btn-sm btn-outline-info rounded-pill px-3" onClick={() => navigate(`/purchase-orders/${po.id}`)}>
          <Eye size={14} className="me-1" /> Details
        </button>
      )
    }
  ];

  return (
    <div className="fade-in">
      <PageHeader 
        title="Procurement Hub" 
        subtitle="Automated purchase order management and tracking"
      />

      <DataTable 
        columns={columns} 
        data={orders} 
        loading={loading} 
      />
    </div>
  );
};

export default PurchaseOrdersPage;
