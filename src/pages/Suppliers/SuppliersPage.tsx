import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, Plus, Save, Edit2, Trash2, Globe, Mail, Phone, User as UserIcon } from 'lucide-react';
import api from '@/services/api';
import PageHeader from '@/components/common/Layout/PageHeader';
import DataTable from '@/components/common/Tables/DataTable';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', contact: '', email: '', phone: '', status: 'ACTIVE' });

  const fetchSuppliers = async () => {
    try {
      const data = await api.suppliers.getAll();
      setSuppliers(data);
    } catch (err) {
      console.error('Failed to fetch suppliers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const openAddModal = () => {
    setFormData({ name: '', contact: '', email: '', phone: '', status: 'ACTIVE' });
    setEditingSupplier(null);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (s: any) => {
    setFormData({ name: s.name || '', contact: s.contact || '', email: s.email || '', phone: s.phone || '', status: s.status || 'ACTIVE' });
    setEditingSupplier(s);
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingSupplier) {
        await api.suppliers.update(editingSupplier.id, formData);
      } else {
        await api.suppliers.create(formData);
      }
      await fetchSuppliers();
      setShowModal(false);
      setEditingSupplier(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data || 'Failed to save supplier.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (supplier: any) => {
    if (!confirm(`Delete supplier "${supplier.name}"?`)) return;
    try {
      await api.suppliers.delete(supplier.id);
      setSuppliers(suppliers.filter(s => s.id !== supplier.id));
    } catch (err) {
      console.error('Failed to delete supplier', err);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Network Node',
      render: (supplier: any) => (
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-3 bg-light-subtle d-flex align-items-center justify-content-center border" style={{ width: '40px', height: '40px' }}>
            <Globe size={18} className="text-primary" />
          </div>
          <div>
            <span className="fw-bold text-inherit tracking-tight d-block">{supplier.name}</span>
            <span className="small fw-black text-muted text-uppercase tracking-widest" style={{ fontSize: '9px' }}>{supplier.status}</span>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Primary Interface',
      render: (supplier: any) => (
        <div className="d-grid gap-1">
          <div className="d-flex align-items-center gap-2 small fw-bold text-inherit">
             <UserIcon size={12} className="text-primary"/> {supplier.contact || 'Main Desk'}
          </div>
          <div className="d-flex align-items-center gap-2 small text-muted font-monospace" style={{ fontSize: '10px' }}>
             <Mail size={10}/> {supplier.email || `contact@${(supplier.name || '').toLowerCase().replace(/\s+/g, '')}.com`}
          </div>
        </div>
      )
    },
    {
      key: 'score',
      label: 'Reliability Index',
      render: (supplier: any) => {
        const score = supplier.score || 0;
        return (
          <div className="w-100 max-width-xs d-grid gap-2" style={{ maxWidth: '200px' }}>
            <div className="d-flex justify-content-between align-items-center small fw-black text-uppercase tracking-widest" style={{ fontSize: '10px' }}>
               <span className="text-muted">Sync Rate</span>
               <span className="text-primary">{score}%</span>
            </div>
            <div className="progress" style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
               <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${score}%` }} />
            </div>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Operations',
      align: 'end' as const,
      render: (supplier: any) => (
        <div className="d-flex justify-end gap-2">
          <button onClick={() => openEditModal(supplier)} className="btn btn-sm btn-outline-secondary border-0 p-2"><Edit2 size={14} /></button>
          <button onClick={() => handleDelete(supplier)} className="btn btn-sm btn-outline-danger border-0 p-2"><Trash2 size={14} /></button>
          <Link to={`/dashboard/suppliers/${supplier.id}`} className="btn btn-sm btn-outline-primary border-0 p-2"><Eye size={14} /></Link>
        </div>
      )
    }
  ];

  return (
    <div className="py-4 animate-in fade-in duration-700">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-4 mb-5">
        <PageHeader
          title="Supply Chain Network"
          subtitle="Verified orbital distribution partners and AI-vetted logistics nodes"
        />
        <button
          onClick={openAddModal}
          className="btn btn-primary px-4 py-3 fw-black small text-uppercase tracking-widest rounded-3 shadow-lg"
        >
          <Plus size={18} strokeWidth={3} className="me-2"/> Integrated New Partner
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <DataTable
          columns={columns}
          data={suppliers}
          loading={loading}
        />
      </div>

      {/* Supplier Modal */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex align-items-center justify-center p-3">
           <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 backdrop-blur-sm" onClick={() => setShowModal(false)} />
           <div className="glass-card w-100 position-relative z-index-1 overflow-hidden shadow-lg" style={{ maxWidth: '500px' }}>
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light-subtle">
                 <h3 className="fs-5 fw-black text-inherit fst-italic m-0">{editingSupplier ? 'EDIT PARTNER' : 'ADD PARTNER'}</h3>
                 <button onClick={() => setShowModal(false)} className="btn btn-link text-muted p-0 text-decoration-none shadow-none">✕</button>
              </div>
              <form onSubmit={handleSave} className="p-4 d-grid gap-4">
                 {error && <div className="p-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 text-danger small fw-bold rounded-3">{error}</div>}
                 
                 <div className="d-grid gap-3">
                    <div>
                        <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Organization Name</label>
                        <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Primary Contact</label>
                        <input type="text" className="form-control" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                    </div>
                    <div className="row g-2">
                       <div className="col-12 col-md-6">
                           <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Interface Email</label>
                           <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                       </div>
                       <div className="col-12 col-md-6">
                           <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Voice Line</label>
                           <input type="tel" className="form-control" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                       </div>
                    </div>
                    <div>
                        <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Node Status</label>
                        <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </div>
                 </div>

                 <div className="d-flex gap-3 pt-4 border-top">
                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-light-subtle flex-grow-1 py-3 fw-black text-uppercase tracking-widest" style={{ fontSize: '10px' }}>ABORT</button>
                    <button type="submit" disabled={saving} className="btn btn-primary flex-grow-1 py-3 fw-black text-uppercase tracking-widest shadow-sm">
                       {saving ? 'SYNCING...' : editingSupplier ? 'COMMIT UPDATES' : 'AUTHORIZE PARTNER'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;
