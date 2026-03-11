import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Star, Globe, ShieldCheck, Zap, BarChart2, Eye } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../shared/Layout/PageHeader';
import DataTable from '../../shared/Tables/DataTable';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await api.suppliers.getAll();
        setSuppliers(data);
      } catch (error) {
        console.error('Failed to fetch suppliers', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const columns = [
    {
      key: 'name',
      label: 'SUPPLIER NAME',
      render: (supplier: any) => (
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 rounded-3 border d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: '#F0FBFF', borderColor: '#BCE8F5', color: '#00BFFF' }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="fw-bold fs-6 d-block" style={{ color: '#00BFFF' }}>{supplier.name}</span>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'PRIMARY CONTACT',
      render: (supplier: any) => (
        <div>
          <span className="fw-bold text-dark d-block" style={{ fontSize: '0.9rem' }}>{supplier.contact}</span>
          <span className="text-muted small d-block" style={{ fontSize: '0.8rem' }}>{supplier.email || `contact@${supplier.name.toLowerCase().replace(/\s+/g, '')}.com`}</span>
        </div>
      )
    },
    {
      key: 'score',
      label: 'PERFORMANCE SCORE',
      render: (supplier: any) => (
        <div className="d-flex align-items-center justify-content-between gap-3 w-100 pe-4">
          <div className="progress flex-grow-1 rounded-pill bg-light" style={{ height: '6px', maxWidth: '300px' }}>
            <div
              className="progress-bar rounded-pill"
              role="progressbar"
              style={{ width: `${supplier.score}%`, backgroundColor: '#00BFFF' }}
            ></div>
          </div>
          <span className="fw-bold" style={{ color: '#00BFFF', minWidth: '40px' }}>{Math.round((supplier.score / 100) * 1000)}%</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      align: 'end' as const,
      render: (supplier: any) => (
        <div className="d-flex justify-content-end">
          <Link
            to={`/suppliers/${supplier.id}`}
            className="btn btn-sm rounded-2 d-flex align-items-center justify-content-center transition-all"
            style={{ 
              background: '#E0F7FA',
              color: '#00BFFF',
              width: '32px', 
              height: '32px',
              border: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#B2EBF2';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#E0F7FA';
            }}
            title="View Scorecard"
          >
            <Eye size={18} strokeWidth={2} />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Supply Chain Nodes"
        subtitle="Verified pharmaceutical distribution partners and AI-vetted suppliers"
      />

      <div className="glass-card border-0">
        <DataTable
          columns={columns}
          data={suppliers}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default SuppliersPage;
