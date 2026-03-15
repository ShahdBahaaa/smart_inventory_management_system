import React, { useState, useEffect } from 'react';
import { PackageCheck, Plus, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/common/Layout/PageHeader';
import api from '@/services/api';

interface BatchEntry {
  productId: string;
  lotNumber: string;
  expiryDate: string;
  quantity: number;
}

const ReceivingPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [poId, setPoId] = useState('PO-2026-001');
  const [batches, setBatches] = useState<BatchEntry[]>([
    { productId: '', lotNumber: '', expiryDate: '', quantity: 0 },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.products.getAll()
      .then(setProducts)
      .catch(() => setError('Failed to load products.'));
  }, []);

  const addRow = () => setBatches(prev => [...prev, { productId: '', lotNumber: '', expiryDate: '', quantity: 0 }]);

  const removeRow = (i: number) => setBatches(prev => prev.filter((_, idx) => idx !== i));

  const updateRow = (i: number, field: keyof BatchEntry, value: string | number) => {
    setBatches(prev => prev.map((b, idx) => idx === i ? { ...b, [field]: value } : b));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulate submission
      await new Promise(r => setTimeout(r, 600));
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
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
          <h2 className="fw-bold text-dark mb-2">Shipment Received</h2>
          <p className="text-muted mb-4">Inventory levels have been updated and all batches have been logged.</p>
          <button className="btn btn-info text-white border-0" onClick={() => { setSubmitted(false); setBatches([{ productId: '', lotNumber: '', expiryDate: '', quantity: 0 }]); }}>
            Receive Another Shipment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeader title="Receive Shipment" subtitle="Record incoming stock, batches, and expiry dates" />

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="glass-card p-4 border-0 mb-4">
          <h5 className="fw-bold text-dark mb-4">Shipment Reference</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted">Purchase Order (PO ID)</label>
              <input
                type="text"
                className="form-control"
                value={poId}
                onChange={e => setPoId(e.target.value)}
                placeholder="e.g. PO-2026-001"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted">Received Date</label>
              <input
                type="date"
                className="form-control"
                defaultValue={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-4 border-0 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-dark mb-0">Batch Details</h5>
            <button type="button" className="btn btn-outline-info btn-sm d-flex align-items-center gap-2" onClick={addRow}>
              <Plus size={14} /> Add Batch
            </button>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Lot / Batch No.</th>
                  <th>Expiry Date</th>
                  <th>Quantity</th>
                  <th className="text-end">FEFO Suggestion</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch, i) => {
                  // FEFO: flag if expiry is within 90 days
                  const expiry = batch.expiryDate ? new Date(batch.expiryDate) : null;
                  const daysToExpiry = expiry ? Math.ceil((expiry.getTime() - Date.now()) / 86400000) : null;
                  const isNearExpiry = daysToExpiry !== null && daysToExpiry < 90;
                  return (
                    <tr key={i}>
                      <td style={{ minWidth: '180px' }}>
                        <select
                          className="form-select form-select-sm"
                          value={batch.productId}
                          onChange={e => updateRow(i, 'productId', e.target.value)}
                          required
                        >
                          <option value="">Select Product</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={batch.lotNumber}
                          onChange={e => updateRow(i, 'lotNumber', e.target.value)}
                          placeholder="LOT-XXXX"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className={`form-control form-control-sm ${isNearExpiry ? 'border-warning' : ''}`}
                          value={batch.expiryDate}
                          onChange={e => updateRow(i, 'expiryDate', e.target.value)}
                          required
                        />
                      </td>
                      <td style={{ maxWidth: '100px' }}>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={batch.quantity}
                          onChange={e => updateRow(i, 'quantity', parseInt(e.target.value) || 0)}
                          min={1}
                          required
                        />
                      </td>
                      <td className="text-end">
                        {isNearExpiry && daysToExpiry !== null && (
                          <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 small">
                            {'\u26A0'} {daysToExpiry}d {'\u2014'} Pick First (FEFO)
                          </span>
                        )}
                        {!isNearExpiry && batch.expiryDate && (
                          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 small">
                            {'\u2713'} Safe Expiry
                          </span>
                        )}
                      </td>
                      <td>
                        {batches.length > 1 && (
                          <button type="button" className="btn btn-sm btn-outline-danger border-0" onClick={() => removeRow(i)}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3">
          <button type="button" className="btn btn-light px-4">Cancel</button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-info text-white border-0 px-5 py-2 fw-bold d-flex align-items-center gap-2"
          >
            {loading ? <span className="spinner-border spinner-border-sm" /> : <PackageCheck size={18} />}
            Confirm Receipt
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReceivingPage;
