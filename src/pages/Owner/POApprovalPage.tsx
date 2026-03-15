import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/common/Layout/PageHeader';
import { usePO } from '@/store/POContext';

const statusColors: Record<string, string> = {
  DRAFT: 'secondary',
  SENT: 'info',
  APPROVED: 'success',
  REJECTED: 'danger',
  RECEIVED: 'primary',
  CLOSED: 'dark',
};

const POApprovalPage = () => {
  const { orders, updateOrderStatus, loading } = usePO();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'danger') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };


  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    setActionLoading(id + action);
    try {
      await new Promise(r => setTimeout(r, 500));
      updateOrderStatus(id, action);
      showToast(`PO ${id} has been ${action.toLowerCase()}.`, action === 'APPROVED' ? 'success' : 'danger');
    } catch {
      showToast('Action failed. Please try again.', 'danger');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'SENT' || o.status === 'DRAFT');
  const processedOrders = orders.filter(o => o.status !== 'SENT' && o.status !== 'DRAFT');

  return (
    <div className="fade-in">
      <PageHeader title="PO Approval Center" subtitle="Review, approve, or reject pending purchase orders" />

      {/* Toast */}
      {toast && (
        <div className={`alert alert-${toast.type} d-flex align-items-center gap-2 mb-4 alert-dismissible`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {toast.message}
        </div>
      )}

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Pending Section */}
      <div className="mb-5">
        <div className="d-flex align-items-center gap-2 mb-3">
          <Clock size={20} className="text-warning" />
          <h5 className="fw-bold mb-0">Awaiting Approval <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 ms-2">{pendingOrders.length}</span></h5>
        </div>

        {loading ? (
          <div className="text-center py-4"><span className="spinner-border text-info" /></div>
        ) : pendingOrders.length === 0 ? (
          <div className="glass-card p-4 text-center text-muted border-0">No pending POs requiring approval.</div>
        ) : (
          <div className="row g-3">
            {pendingOrders.map(po => (
              <div key={po.id} className="col-12">
                <div className="glass-card p-4 border-0 d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-bold text-dark mb-1">{po.id}</p>
                    <p className="small text-muted mb-1">{po.supplier} {'\u00B7'} {po.date}</p>
                    <span className={`badge bg-${statusColors[po.status] || 'secondary'} bg-opacity-10 text-${statusColors[po.status] || 'secondary'} border border-${statusColors[po.status] || 'secondary'} border-opacity-25`}>
                      {po.status}
                    </span>
                  </div>
                  <div className="text-end">
                    <p className="h5 fw-bold text-dark mb-1">${po.total?.toLocaleString() ?? '\u2014'}</p>
                    <p className="small text-muted">Total Value</p>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-success d-flex align-items-center gap-2 fw-bold"
                      disabled={!!actionLoading}
                      onClick={() => handleAction(po.id, 'APPROVED')}
                    >
                      {actionLoading === po.id + 'APPROVED' ? <span className="spinner-border spinner-border-sm" /> : <CheckCircle size={16} />}
                      Approve
                    </button>
                    <button
                      className="btn btn-outline-danger d-flex align-items-center gap-2 fw-bold"
                      disabled={!!actionLoading}
                      onClick={() => handleAction(po.id, 'REJECTED')}
                    >
                      {actionLoading === po.id + 'REJECTED' ? <span className="spinner-border spinner-border-sm" /> : <XCircle size={16} />}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Processed Section */}
      <div>
        <h5 className="fw-bold mb-3 text-muted">Processed Orders</h5>
        <div className="glass-card border-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>PO ID</th>
                  <th>Supplier</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {processedOrders.map(po => (
                  <tr key={po.id}>
                    <td className="fw-bold">{po.id}</td>
                    <td>{po.supplier}</td>
                    <td className="text-muted small">{po.date}</td>
                    <td>${po.total?.toLocaleString()}</td>
                    <td>
                      <span className={`badge bg-${statusColors[po.status] || 'secondary'} bg-opacity-10 text-${statusColors[po.status] || 'secondary'} border border-${statusColors[po.status] || 'secondary'} border-opacity-25`}>
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POApprovalPage;
