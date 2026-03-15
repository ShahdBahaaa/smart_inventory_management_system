import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Star, Globe, ShieldCheck, Zap, BarChart2, Eye, Plus, Save } from 'lucide-react';
import api from '@/services/api';
import PageHeader from '@/components/common/Layout/PageHeader';
import DataTable from '@/components/common/Tables/DataTable';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', email: '', phone: '', status: 'ACTIVE' });

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier = { 
      id: Date.now().toString(), 
      score: 85, 
      ...formData 
    };
    setSuppliers([...suppliers, newSupplier]);
    setShowAddModal(false);
    setFormData({ name: '', contact: '', email: '', phone: '', status: 'ACTIVE' });
  };

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
            to={`/dashboard/suppliers/${supplier.id}`}
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <PageHeader
          title="Supply Chain Nodes"
          subtitle="Verified pharmaceutical distribution partners and AI-vetted suppliers"
        />
        <button
          className="btn d-flex align-items-center gap-2 rounded-pill px-4 py-2 fw-bold transition-all"
          onClick={() => {
            setFormData({ name: '', contact: '', email: '', phone: '', status: 'ACTIVE' });
            setShowAddModal(true);
          }}
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
          <Plus size={20} strokeWidth={3} />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="glass-card border-0">
        <DataTable
          columns={columns}
          data={suppliers}
          loading={loading}
        />
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border-0">
              <div className="modal-header border-secondary border-opacity-10">
                <h5 className="modal-title fw-bold neon-text">Add New Supplier</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleCreateSupplier}>
                <div className="modal-body py-4">
                  <div className="mb-3">
                    <label className="form-label small text-muted fw-bold">Supplier Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted fw-bold">Primary Contact Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted fw-bold">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-10">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-info text-white border-0 shadow-glow" style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)' }}>
                    <Save size={16} className="me-2 d-inline-block" />
                    Add Supplier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;
