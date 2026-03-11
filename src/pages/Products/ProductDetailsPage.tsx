import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, Tag, Info, Activity, ShieldCheck, Zap, ShieldAlert, Plus, Edit2, Save } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../shared/Tables/DataTable';

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOnlyExpired, setShowOnlyExpired] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<any>(null);
  const [formData, setFormData] = useState({ lotNumber: '', expiryDate: '', quantity: 0, status: 'ACTIVE' });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await api.products.getById(id);
        setProduct(data);

        // Check for batches expiring within 7 days
        const today = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(today.getDate() + 7);

        const expiringBatches = data.batches.filter((b: any) => {
          const expiryDate = new Date(b.expiryDate);
          return expiryDate >= today && expiryDate <= sevenDaysFromNow;
        });

        if (expiringBatches.length > 0) {
          const msgs = expiringBatches.map((b: any) =>
            `Critical Alert: Batch ${b.lotNumber} is set to expire on ${new Date(b.expiryDate).toLocaleDateString()}. Immediate action required.`
          );
          setNotifications(msgs);
        }
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSaveBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    let updatedBatches;
    if (editingBatch) {
      updatedBatches = product.batches.map((b: any) =>
        b.id === editingBatch.id ? { ...b, ...formData } : b
      );
    } else {
      const newBatch = {
        id: Date.now(),
        productId: product.id,
        ...formData
      };
      updatedBatches = [...product.batches, newBatch];
    }
    setProduct({ ...product, batches: updatedBatches });
    setShowBatchModal(false);
    setEditingBatch(null);
  };

  const openAddBatchModal = () => {
    setFormData({ lotNumber: '', expiryDate: '', quantity: 0, status: 'ACTIVE' });
    setEditingBatch(null);
    setShowBatchModal(true);
  };

  const openEditBatchModal = (batch: any) => {
    setFormData({
      lotNumber: batch.lotNumber,
      expiryDate: batch.expiryDate,
      quantity: batch.quantity,
      status: batch.status
    });
    setEditingBatch(batch);
    setShowBatchModal(true);
  };

  const filteredBatches = product?.batches.filter((b: any) => {
    if (showOnlyExpired) {
      return new Date(b.expiryDate) < new Date();
    }
    return true;
  }) || [];

  const batchColumns = [
    {
      key: 'lotNumber',
      label: 'Batch ID',
      render: (batch: any) => <span className="fw-medium neon-text">{batch.lotNumber}</span>
    },
    {
      key: 'expiryDate',
      label: 'Stability Expiry',
      render: (batch: any) => {
        const isExpired = new Date(batch.expiryDate) < new Date();
        return (
          <div className="d-flex align-items-center gap-2">
            <Calendar size={14} className={isExpired ? 'text-danger' : 'text-info'} />
            <span className={isExpired ? 'text-danger fw-bold' : 'opacity-75'}>
              {new Date(batch.expiryDate).toLocaleDateString()}
            </span>
          </div>
        );
      }
    },
    { key: 'quantity', label: 'Unit Count', render: (batch: any) => <span className="fw-bold">{batch.quantity}</span> },
    {
      key: 'status',
      label: 'Quality Status',
      render: (batch: any) => {
        const isExpired = new Date(batch.expiryDate) < new Date();
        return isExpired || batch.status === 'EXPIRED' ? (
          <span className="badge badge-danger">EXPIRED</span>
        ) : (
          <span className={`badge ${batch.status === 'ACTIVE' ? 'badge-valid' : 'bg-warning'}`}>{batch.status}</span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'end' as const,
      render: (batch: any) => (
        <button
          className="btn btn-sm btn-outline-info border-0 bg-info-subtle bg-opacity-10"
          title="Edit Batch"
          onClick={() => openEditBatchModal(batch)}
        >
          <Edit2 size={16} />
        </button>
      )
    }
  ];

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-info" role="status"></div>
    </div>
  );

  if (!product) return <div className="alert bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger">Molecular node not found in registry</div>;

  const expiredBatchesCount = product.batches.filter((b: any) => new Date(b.expiryDate) < new Date()).length;

  return (
    <div className="fade-in">
      <div className="mb-4">
        <Link to="/products" className="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0 text-info opacity-75 hover-opacity-100">
          <ArrowLeft size={18} />
          Back to Products Inventory
        </Link>
      </div>

      {notifications.length > 0 && (
        <div className="mb-4">
          {notifications.map((note, idx) => (
            <div key={idx} className="alert glass-card border-danger border-opacity-50 text-danger d-flex align-items-center gap-3 mb-2 py-3">
              <ShieldAlert size={20} className="pulse-animation" />
              <div>
                <strong className="d-block small text-uppercase opacity-75">Stability Warning</strong>
                <span>{note}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="glass-card p-4 border-0">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2 className="mb-1 fw-bold neon-text">{product.name}</h2>
                <p className="text-muted mb-0">Registry ID: <span className="font-monospace text-info">{product.sku}</span></p>
              </div>
              <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-20 px-3 py-2">{product.category}</span>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded-3 text-info border border-info border-opacity-10">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="text-muted small mb-0">Current Stock</p>
                    <h4 className="mb-0 fw-bold neon-text">{product.stock} Units</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded-3 text-info border border-info border-opacity-10">
                    <Tag size={24} />
                  </div>
                  <div>
                    <p className="text-muted small mb-0">Source Node</p>
                    <h4 className="mb-0 fw-bold text-dark">{product.supplier}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded-3 text-info border border-info border-opacity-10">
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="text-muted small mb-0">System Status</p>
                    <h4 className="mb-0 fw-bold text-success">OPERATIONAL</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-card p-4 border-0 h-100">
            <h5 className="mb-3 fw-bold text-dark">AI Risk Assessment</h5>
            <div className="d-flex flex-column gap-3">
              <div className="p-3 bg-light rounded-3 border border-secondary border-opacity-10">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-muted">Stock Stability</span>
                  <span className="small text-success fw-bold">HIGH</span>
                </div>
                <div className="progress bg-secondary bg-opacity-10" style={{ height: '4px' }}>
                  <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-light rounded-3 border border-secondary border-opacity-10">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-muted">Expiry Risk</span>
                  <span className="small text-info fw-bold">LOW</span>
                </div>
                <div className="progress bg-secondary bg-opacity-10" style={{ height: '4px' }}>
                  <div className="progress-bar bg-info" style={{ width: '12%' }}></div>
                </div>
              </div>
              <div className="mt-2 d-flex align-items-center gap-2 text-info small">
                <ShieldCheck size={16} />
                <span>AI-Verified Inventory Node</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card border-0 overflow-hidden">
        <div className="py-3 px-4 border-bottom border-secondary border-opacity-10 d-flex justify-content-between align-items-center bg-light">
          <div className="d-flex align-items-center gap-2">
            <Zap size={18} className="text-info" />
            <h5 className="mb-0 fw-bold text-dark">Batch Distribution Registry</h5>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <div className="form-check form-switch">
              <input
                className="form-check-input border-info"
                type="checkbox"
                id="expiredFilter"
                checked={showOnlyExpired}
                onChange={(e) => setShowOnlyExpired(e.target.checked)}
              />
              <label className="form-check-label text-muted small" htmlFor="expiredFilter">
                Show Only Expired
              </label>
            </div>
            <button
              className="btn btn-sm btn-info text-white d-flex align-items-center gap-1 shadow-glow border-0"
              onClick={openAddBatchModal}
            >
              <Plus size={14} /> Add Batch
            </button>
            <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-20 d-none d-md-inline">
              {product.batches.length} Active Batches
            </span>
          </div>
        </div>
        <DataTable columns={batchColumns} data={filteredBatches} />
      </div>

      {/* Add / Edit Batch Modal */}
      {showBatchModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border-0">
              <div className="modal-header border-secondary border-opacity-10">
                <h5 className="modal-title fw-bold neon-text">
                  {editingBatch ? 'Edit Batch' : 'Add New Batch'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowBatchModal(false)}></button>
              </div>
              <form onSubmit={handleSaveBatch}>
                <div className="modal-body py-4">
                  <div className="mb-3">
                    <label className="form-label small text-muted fw-bold">Batch ID / Lot Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.lotNumber}
                      onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted fw-bold">Expiry Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="QUARANTINE">Quarantine</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-10">
                  <button type="button" className="btn btn-light" onClick={() => setShowBatchModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-info text-white border-0 shadow-glow" style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)' }}>
                    <Save size={16} className="me-2 d-inline-block" />
                    {editingBatch ? 'Save Updates' : 'Add Batch'}
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

export default ProductDetailsPage;
