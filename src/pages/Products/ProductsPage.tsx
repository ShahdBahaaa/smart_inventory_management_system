import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Activity, ShieldAlert, FlaskConical, Hash, Settings, Plus, Edit2, Save, Trash2, Tag, Box } from 'lucide-react';
import api from '@/services/api';
import PageHeader from '@/components/common/Layout/PageHeader';
import DataTable from '@/components/common/Tables/DataTable';

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSku, setSelectedSku] = useState('');
  const [error, setError] = useState('');

  const [editingThreshold, setEditingThreshold] = useState<any>(null);
  const [newThreshold, setNewThreshold] = useState<number>(50);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    sku: '', name: '', category: '', supplierID: 0, price: 0, lowStockThreshold: 50, description: ''
  });

  const fetchProducts = async () => {
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    api.suppliers.getAll().then(setSuppliers).catch(console.error);
  }, []);

  const handleUpdateThreshold = async () => {
    if (!editingThreshold) return;
    setSaving(true);
    try {
      await api.products.update(editingThreshold.id, { lowStockThreshold: newThreshold });
      setProducts(products.map(p =>
        p.id === editingThreshold.id ? { ...p, lowStockThreshold: newThreshold } : p
      ));
      setEditingThreshold(null);
    } catch (err: any) {
      console.error('Failed to update threshold', err);
      setError('Failed to update threshold.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, {
          name: formData.name,
          category: formData.category,
          description: formData.description,
          price: formData.price,
          lowStockThreshold: formData.lowStockThreshold,
          supplierID: formData.supplierID,
        });
      } else {
        await api.products.create({
          sku: formData.sku,
          name: formData.name,
          category: formData.category,
          supplierID: formData.supplierID,
          description: formData.description,
          price: formData.price,
          lowStockThreshold: formData.lowStockThreshold,
        });
      }
      await fetchProducts();
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data || 'Failed to save product.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (prod: any) => {
    if (!confirm(`Delete "${prod.name}"?`)) return;
    try {
      await api.products.delete(prod.id);
      setProducts(products.filter(p => p.id !== prod.id));
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const openAddModal = () => {
    setFormData({ sku: '', name: '', category: '', supplierID: suppliers[0]?.id || 0, price: 0, lowStockThreshold: 50, description: '' });
    setEditingProduct(null);
    setError('');
    setShowProductModal(true);
  };

  const openEditModal = (prod: any) => {
    setFormData({
      sku: prod.sku || '',
      name: prod.name || '',
      category: prod.category || '',
      supplierID: prod.supplierID || suppliers[0]?.id || 0,
      price: prod.price || 0,
      lowStockThreshold: prod.lowStockThreshold || 50,
      description: prod.description || ''
    });
    setEditingProduct(prod);
    setError('');
    setShowProductModal(true);
  };

  const uniqueSkus = Array.from(new Set(products.map(prod => prod.sku))).sort();
  const uniqueCategories = Array.from(new Set(products.map(prod => prod.category))).sort();

  const filteredProducts = products.filter(prod => {
    const matchesSearch = (prod.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prod.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prod.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || prod.category === selectedCategory;
    const matchesSku = selectedSku === '' || prod.sku === selectedSku;
    return matchesSearch && matchesCategory && matchesSku;
  });

  const getExpiryBadge = (status: string) => {
    const s = status?.toUpperCase() || '';
    if (s === 'EXPIRED') return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 small text-uppercase" style={{ fontSize: '10px' }}>EXPIRED</span>;
    if (s === 'EXPIRING_SOON' || s === 'NEAR_EXPIRY') return <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 small text-uppercase pulse-animation" style={{ fontSize: '10px' }}>CRITICAL</span>;
    return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 small text-uppercase" style={{ fontSize: '10px' }}>STABLE</span>;
  };

  const columns = [
    {
      key: 'name',
      label: 'Inventory Node',
      render: (prod: any) => (
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-3 bg-light-subtle d-flex align-items-center justify-content-center border" style={{ width: '32px', height: '32px' }}>
            <FlaskConical size={16} className="text-primary" />
          </div>
          <div className="d-flex flex-column">
            <span className="fw-bold text-inherit m-0" style={{ fontSize: '14px' }}>{prod.name}</span>
            <span className="small fw-black text-muted text-uppercase tracking-tighter font-monospace" style={{ fontSize: '10px' }}>{prod.sku}</span>
          </div>
        </div>
      )
    },
    { key: 'category', label: 'Sector', render: (prod: any) => <span className="small fw-black text-muted text-uppercase tracking-widest" style={{ fontSize: '10px' }}>{prod.category}</span> },
    {
      key: 'stock',
      label: 'Units',
      render: (prod: any) => {
        const isLow = prod.stock < (prod.lowStockThreshold || 50);
        return (
          <div className="d-flex align-items-center gap-2">
            <span className={`fw-black fs-5 fst-italic ${isLow ? 'text-danger' : 'text-inherit'}`}>
              {prod.stock}
            </span>
            {isLow && <ShieldAlert size={14} className="text-danger pulse-animation" />}
          </div>
        );
      }
    },
    { key: 'expiryStatus', label: 'Neural Status', render: (prod: any) => getExpiryBadge(prod.expiryStatus) },
    {
      key: 'actions',
      label: 'Operations',
      align: 'end' as const,
      render: (prod: any) => (
        <div className="d-flex justify-end gap-2">
          <button onClick={() => openEditModal(prod)} className="btn btn-sm btn-outline-secondary border-0 p-2"><Edit2 size={14} /></button>
          <button onClick={() => { setEditingThreshold(prod); setNewThreshold(prod.lowStockThreshold || 50); }} className="btn btn-sm btn-outline-secondary border-0 p-2"><Settings size={14} /></button>
          <Link to={`/dashboard/products/${prod.id}`} className="btn btn-sm btn-outline-primary border-0 p-2"><Eye size={14} /></Link>
        </div>
      )
    }
  ];

  return (
    <div className="py-4 animate-in fade-in duration-700">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-4">
        <PageHeader
          title="Inventory Nodes"
          subtitle="Manage registry, stock telemetry, and predictive thresholds"
        />
        <button
          onClick={openAddModal}
          className="btn btn-primary px-4 py-3 fw-black small text-uppercase tracking-widest rounded-3 shadow-lg"
        >
          <Plus size={18} strokeWidth={3} className="me-2"/> Register New Node
        </button>
      </div>

      <div className="row g-3 mb-5">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="position-relative">
            <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" size={18} />
            <input
              type="text"
              className="form-control ps-5 py-3 rounded-3"
              placeholder="Search SKU or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="position-relative">
            <Filter className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" size={18} />
            <select
              className="form-select ps-5 py-3 rounded-3 cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Sectors</option>
              {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="position-relative">
             <Hash className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" size={18} />
             <select
              className="form-select ps-5 py-3 rounded-3 cursor-pointer"
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
            >
              <option value="">Search SKU</option>
              {uniqueSkus.map(sku => <option key={sku} value={sku}>{sku}</option>)}
            </select>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-2 d-flex align-items-center justify-content-md-end">
           <div className="d-flex align-items-center gap-2 px-3 py-2 bg-light-subtle rounded-3 border">
              <ShieldAlert size={14} className="text-primary animate-pulse"/>
              <span className="small fw-black text-muted text-uppercase tracking-widest" style={{ fontSize: '10px' }}>Live Monitoring</span>
           </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        loading={loading}
      />

      {/* Threshold Modal */}
      {editingThreshold && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex align-items-center justify-center p-3">
           <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 backdrop-blur-sm" onClick={() => setEditingThreshold(null)} />
           <div className="glass-card w-100 max-width-md position-relative z-index-1 overflow-hidden" style={{ maxWidth: '450px' }}>
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light-subtle">
                 <h3 className="fs-5 fw-black text-inherit fst-italic m-0">THRESHOLD CONFIG</h3>
                 <button onClick={() => setEditingThreshold(null)} className="btn btn-link text-muted p-0 text-decoration-none shadow-none">✕</button>
              </div>
              <div className="p-4 d-grid gap-4">
                 <div>
                    <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Selected Node</label>
                    <div className="text-inherit fw-bold p-3 bg-light-subtle rounded-3 border">{editingThreshold.name}</div>
                 </div>
                 <div>
                    <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Critical stock level</label>
                    <input 
                      type="number"
                      className="form-control form-control-lg fw-black text-primary p-3"
                      value={newThreshold}
                      onChange={(e) => setNewThreshold(parseInt(e.target.value))}
                    />
                 </div>
                 <button 
                  onClick={handleUpdateThreshold}
                  disabled={saving}
                  className="btn btn-primary w-100 py-3 fw-black text-uppercase small tracking-widest rounded-3 shadow-sm disabled:opacity-50"
                 >
                   {saving ? 'UPDATING...' : 'SYNC TELEMETRY'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex align-items-center justify-center p-3">
           <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
           <div className="glass-card w-100 position-relative z-index-1 overflow-hidden shadow-lg" style={{ maxWidth: '650px' }}>
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light-subtle">
                 <h3 className="fs-5 fw-black text-inherit fst-italic m-0">{editingProduct ? 'EDIT NODE' : 'REGISTER NODE'}</h3>
                 <button onClick={() => setShowProductModal(false)} className="btn btn-link text-muted p-0 text-decoration-none shadow-none">✕</button>
              </div>
              <form onSubmit={handleSaveProduct} className="p-4 d-grid gap-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
                 {error && <div className="p-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 text-danger small fw-bold rounded-3">{error}</div>}
                 <div className="row g-3">
                    {!editingProduct && (
                      <div className="col-12 col-md-6">
                        <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Registry SKU</label>
                        <input type="text" className="form-control" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required />
                      </div>
                    )}
                    <div className={editingProduct ? 'col-12' : 'col-12 col-md-6'}>
                        <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Node Name</label>
                        <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Sector / Category</label>
                        <input type="text" className="form-control" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Supply Node</label>
                        <select className="form-select" value={formData.supplierID} onChange={(e) => setFormData({ ...formData, supplierID: parseInt(e.target.value) })} required>
                          <option value={0} disabled>Select source...</option>
                          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Standard Price ($)</label>
                        <input type="number" step="0.01" className="form-control" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Risk Threshold</label>
                        <input type="number" className="form-control fw-bold text-primary" value={formData.lowStockThreshold} onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })} required />
                    </div>
                    <div className="col-12">
                        <label className="small fw-black text-muted text-uppercase tracking-widest mb-2 d-block" style={{ fontSize: '10px' }}>Node Description</label>
                        <textarea className="form-control" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                    </div>
                 </div>
                 <div className="d-flex gap-3 pt-4 border-top">
                    <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-light-subtle flex-grow-1 py-3 fw-black text-uppercase tracking-widest" style={{ fontSize: '10px' }}>ABORT</button>
                    <button type="submit" disabled={saving} className="btn btn-primary flex-grow-1 py-3 fw-black text-uppercase tracking-widest shadow-sm">
                       {saving ? 'PROCESSING...' : editingProduct ? 'COMMIT CHANGES' : 'AUTHORIZE REGISTRATION'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
