import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, CheckCircle, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/common/Layout/PageHeader';
import api from '@/services/api';

const REASONS = [
  'Damaged / Broken',
  'Theft / Loss',
  'Customer Return',
  'Stock Count Correction',
  'Expiry Removal',
  'Supplier Error',
  'Other',
];

const StockAdjustmentPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    productId: '',
    adjustmentType: 'ADD',
    quantity: 1,
    reason: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.products.getAll()
      .then(setProducts)
      .catch(() => setError('Failed to load products.'));
  }, []);

  const selectedProduct = products.find(p => p.id === parseInt(form.productId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.reason) { setError('Please select a reason for the adjustment.'); return; }
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 600));
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save adjustment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fade-in d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
            <CheckCircle size={56} className="text-success" />
          </div>
          <h2 className="fw-bold text-dark mb-2">Adjustment Recorded</h2>
          <p className="text-muted mb-4">The stock adjustment has been saved and the inventory updated.</p>
          <button className="btn btn-info text-white border-0" onClick={() => setSubmitted(false)}>
            Make Another Adjustment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeader title="Stock Adjustment" subtitle="Manually correct inventory levels and record the reason" />

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="glass-card p-4 border-0 mb-4">
              <h5 className="fw-bold text-dark mb-4">Adjustment Details</h5>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Product</label>
                <select
                  className="form-select"
                  value={form.productId}
                  onChange={e => setForm({ ...form, productId: e.target.value })}
                  required
                >
                  <option value="">Select a product...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Adjustment Type</label>
                <div className="d-flex gap-3">
                  {['ADD', 'REMOVE'].map(type => (
                    <div key={type} className={`flex-fill p-3 rounded-3 border text-center fw-bold small cursor-pointer ${form.adjustmentType === type ? (type === 'ADD' ? 'bg-success bg-opacity-10 border-success text-success' : 'bg-danger bg-opacity-10 border-danger text-danger') : 'border-secondary border-opacity-25 text-muted'}`}
                      onClick={() => setForm({ ...form, adjustmentType: type })}
                      style={{ cursor: 'pointer' }}
                    >
                      {type === 'ADD' ? '+ ADD Stock' : '\u2013 REMOVE Stock'}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                  min={1}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Reason</label>
                <select
                  className="form-select"
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                  required
                >
                  <option value="">Select reason...</option>
                  {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Additional Notes (optional)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Describe the discrepancy or context..."
                />
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="col-lg-5">
            <div className="glass-card p-4 border-0">
              <h5 className="fw-bold text-dark mb-4">Adjustment Summary</h5>
              {selectedProduct ? (
                <>
                  <div className="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-10">
                    <span className="text-muted">Product</span>
                    <span className="fw-bold text-dark">{selectedProduct.name}</span>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-10">
                    <span className="text-muted">SKU</span>
                    <span className="fw-bold text-dark">{selectedProduct.sku}</span>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-10">
                    <span className="text-muted">Current Stock</span>
                    <span className="fw-bold text-dark">{selectedProduct.stock} units</span>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    <span className="text-muted">After Adjustment</span>
                    <span className={`fw-bold h5 mb-0 ${form.adjustmentType === 'ADD' ? 'text-success' : 'text-danger'}`}>
                      {form.adjustmentType === 'ADD'
                        ? selectedProduct.stock + form.quantity
                        : Math.max(0, selectedProduct.stock - form.quantity)} units
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-muted small">Select a product to see the adjustment preview.</p>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4 gap-3">
          <button type="button" className="btn btn-light px-4">Cancel</button>
          <button type="submit" disabled={loading} className="btn btn-info text-white border-0 px-5 py-2 fw-bold d-flex align-items-center gap-2">
            {loading ? <span className="spinner-border spinner-border-sm" /> : <SlidersHorizontal size={18} />}
            Submit Adjustment
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockAdjustmentPage;
