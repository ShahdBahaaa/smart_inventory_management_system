import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Activity, ShieldAlert, FlaskConical, Hash, Settings, Plus, Edit2, Save } from 'lucide-react';
import api from '@/services/api';
import PageHeader from '@/components/common/Layout/PageHeader';
import DataTable from '@/components/common/Tables/DataTable';

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSku, setSelectedSku] = useState('');

  // Modals state
  const [editingThreshold, setEditingThreshold] = useState<any>(null);
  const [newThreshold, setNewThreshold] = useState<number>(50);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    sku: '', name: '', category: '', supplier: '', price: 0, lowStockThreshold: 50, description: ''
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
  }, []);

  const handleUpdateThreshold = async () => {
    if (!editingThreshold) return;
    try {
      // In a real app, we would call an API. Here we update mock data locally.
      const updatedProds = products.map(prod =>
        prod.id === editingThreshold.id ? { ...prod, lowStockThreshold: newThreshold } : prod
      );
      setProducts(updatedProds);
      setEditingThreshold(null);
    } catch (error) {
      console.error('Failed to update threshold', error);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const updatedProds = products.map(prod =>
        prod.id === editingProduct.id ? { ...prod, ...formData } : prod
      );
      setProducts(updatedProds);
    } else {
      const newProduct = {
        id: Date.now(),
        ...formData,
        stock: 0,
        expiryStatus: 'VALID'
      };
      setProducts([...products, newProduct]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const openAddModal = () => {
    setFormData({ sku: '', name: '', category: '', supplier: '', price: 0, lowStockThreshold: 50, description: '' });
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const openEditModal = (prod: any) => {
    setFormData({
      sku: prod.sku || '',
      name: prod.name || '',
      category: prod.category || '',
      supplier: prod.supplier || '',
      price: prod.price || 0,
      lowStockThreshold: prod.lowStockThreshold || 50,
      description: prod.description || ''
    });
    setEditingProduct(prod);
    setShowProductModal(true);
  };

  const uniqueSkus = Array.from(new Set(products.map(prod => prod.sku))).sort();
  const uniqueCategories = Array.from(new Set(products.map(prod => prod.category))).sort();

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || prod.category === selectedCategory;
    const matchesSku = selectedSku === '' || prod.sku === selectedSku;
    return matchesSearch && matchesCategory && matchesSku;
  });

  const getExpiryBadge = (status: string) => {
    switch (status) {
      case 'GOOD':
      case 'VALID':
        return <span className="badge badge-valid">VALID</span>;
      case 'NEAR_EXPIRY':
      case 'EXPIRING_SOON':
        return <span className="badge badge-warning pulse-animation">EXPIRING SOON</span>;
      case 'EXPIRED':
        return <span className="badge badge-danger">EXPIRED</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary">{status}</span>;
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Product Name',
      render: (prod: any) => (
        <div className="d-flex align-items-center gap-2">
          <FlaskConical size={16} className="text-info" />
          <span className="fw-medium neon-text">{prod.name}</span>
        </div>
      )
    },
    { key: 'sku', label: 'SKU', render: (prod: any) => <span className="font-monospace small opacity-75">{prod.sku}</span> },
    { key: 'category', label: 'Category', render: (prod: any) => <span className="opacity-75">{prod.category}</span> },
    { key: 'supplier', label: 'Supplier' },
    {
      key: 'stock',
      label: 'Stock',
      render: (prod: any) => (
        <div className="d-flex align-items-center gap-2">
          <Activity size={14} className={prod.stock < (prod.lowStockThreshold || 50) ? 'text-danger' : 'text-info'} />
          <span className={`fw-bold ${prod.stock < (prod.lowStockThreshold || 50) ? 'text-danger' : 'neon-text'}`}>
            {prod.stock}
          </span>
          {prod.stock < (prod.lowStockThreshold || 50) && (
            <span title="Low Stock Alert">
              <ShieldAlert size={14} className="text-danger pulse-animation" />
            </span>
          )}
        </div>
      )
    },
    { key: 'expiryStatus', label: 'Status', render: (prod: any) => getExpiryBadge(prod.expiryStatus) },
    {
      key: 'actions',
      label: 'Actions',
      align: 'end' as const,
      render: (prod: any) => (
        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-sm btn-outline-info border-0 bg-info-subtle bg-opacity-10"
            title="Edit Product"
            onClick={() => openEditModal(prod)}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-info border-0 bg-info-subtle bg-opacity-10"
            title="Set Stock Alert"
            onClick={() => {
              setEditingThreshold(prod);
              setNewThreshold(prod.lowStockThreshold || 50);
            }}
          >
            <Settings size={16} />
          </button>
          <Link to={`/dashboard/products/${prod.id}`} className="btn btn-sm btn-outline-info border-0 bg-info-subtle bg-opacity-10" title="View Details">
            <Eye size={16} />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <PageHeader
          title="Products Inventory"
          subtitle="Manage product registry, stock levels, and threshold alerts"
        />
        <button
          className="btn d-flex align-items-center gap-2 rounded-pill px-4 py-2 fw-bold transition-all"
          onClick={openAddModal}
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
          <span>Add Product</span>
        </button>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-6 col-lg-3">
          <div className="input-group glass-card border-0 p-1">
            <span className="input-group-text bg-transparent border-0">
              <Search size={18} className="text-info" />
            </span>
            <input
              type="text"
              className="form-control bg-transparent border-0 text-dark"
              placeholder="Search by SKU, name, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6 col-lg-2">
          <div className="input-group glass-card border-0 p-1">
            <span className="input-group-text bg-transparent border-0">
              <Filter size={18} className="text-info" />
            </span>
            <select
              className="form-select bg-transparent border-0 text-dark"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6 col-lg-2">
          <div className="input-group glass-card border-0 p-1">
            <span className="input-group-text bg-transparent border-0">
              <Hash size={18} className="text-info" />
            </span>
            <select
              className="form-select bg-transparent border-0 text-dark"
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
            >
              <option value="">All SKUs</option>
              {uniqueSkus.map(sku => (
                <option key={sku} value={sku}>{sku}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-lg-5 d-flex align-items-center justify-content-end">
          <div className="d-flex align-items-center gap-2 text-info small">
            <ShieldAlert size={16} />
            <span className="opacity-75">AI Risk Assessment: Active</span>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        loading={loading}
      />

      {/* Threshold Edit Modal */}
      {editingThreshold && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border-secondary border-opacity-10">
              <div className="modal-header border-secondary border-opacity-10">
                <h5 className="modal-title neon-text fw-bold">Configure Stock Alert</h5>
                <button type="button" className="btn-close" onClick={() => setEditingThreshold(null)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="mb-3">
                  <label className="form-label text-muted small text-uppercase fw-bold">Product Name</label>
                  <div className="p-3 bg-light rounded-3 border border-secondary border-opacity-10 text-dark fw-bold">
                    {editingThreshold.name}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="threshold" className="form-label text-muted small text-uppercase fw-bold">Low Stock Threshold</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-secondary border-opacity-10 text-info">
                      <Activity size={18} />
                    </span>
                    <input
                      type="number"
                      className="form-control bg-white border-secondary border-opacity-10 text-dark"
                      id="threshold"
                      value={newThreshold}
                      onChange={(e) => setNewThreshold(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-text text-muted small mt-2">
                    System will trigger a critical alert when inventory falls below this level.
                  </div>
                </div>
              </div>
              <div className="modal-footer border-secondary border-opacity-10">
                <button type="button" className="btn btn-outline-secondary border-0" onClick={() => setEditingThreshold(null)}>Cancel</button>
                <button type="button" className="btn btn-info px-4 shadow-glow" onClick={handleUpdateThreshold}>Update Threshold</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content glass-card border-0">
              <div className="modal-header border-secondary border-opacity-10">
                <h5 className="modal-title fw-bold neon-text">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowProductModal(false)}></button>
              </div>
              <form onSubmit={handleSaveProduct}>
                <div className="modal-body py-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small text-muted fw-bold">SKU</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label small text-muted fw-bold">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">Supplier</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">Reorder Level</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.lowStockThreshold}
                        onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small text-muted fw-bold">Description</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-10">
                  <button type="button" className="btn btn-light" onClick={() => setShowProductModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-info text-white border-0 shadow-glow" style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)' }}>
                    <Save size={16} className="me-2 d-inline-block" />
                    {editingProduct ? 'Save Updates' : 'Add Product'}
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

export default ProductsPage;
