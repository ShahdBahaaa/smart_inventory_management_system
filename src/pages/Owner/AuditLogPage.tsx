import React, { useState, useEffect } from 'react';
import { History, Search, Filter, User, Download, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/common/Layout/PageHeader';
import api from '@/services/api';

const actionColors: Record<string, string> = {
  CREATE_PRODUCT: 'success',
  CREATE_USER: 'success',
  UPDATE_STOCK: 'info',
  UPDATE_PRODUCT: 'primary',
  APPROVE_PO: 'success',
  REJECT_PO: 'danger',
  RECEIVE_SHIPMENT: 'info',
  DELETE_BATCH: 'warning',
  LOGIN: 'info',
  REGISTER: 'info',
  LOGOUT: 'secondary',
};

const AuditLogPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.audit.getAll();
        setLogs(data);
      } catch (err: any) {
        setError('Failed to load audit logs.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const uniqueActions = ['ALL', ...Array.from(new Set(logs.map(l => l.action)))];

  const filtered = logs.filter(log => {
    const matchSearch = log.userName.toLowerCase().includes(search.toLowerCase())
      || log.action.toLowerCase().includes(search.toLowerCase())
      || log.details.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Details'],
      ...filtered.map(l => [new Date(l.date).toLocaleString(), l.userName, l.action, l.details])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-log.csv';
    a.click();
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="System Audit Log"
        subtitle="Track all user actions and system changes"
      />

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      <div className="glass-card border-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-bottom border-secondary border-opacity-10 d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div className="d-flex gap-3 flex-wrap flex-grow-1">
            {/* Search */}
            <div className="input-group" style={{ maxWidth: '320px' }}>
              <span className="input-group-text bg-white border-secondary border-opacity-25">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-secondary border-opacity-25"
                placeholder="Search user, action, details..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Action filter */}
            <div className="input-group" style={{ maxWidth: '200px' }}>
              <span className="input-group-text bg-white border-secondary border-opacity-25">
                <Filter size={16} className="text-muted" />
              </span>
              <select
                className="form-select border-secondary border-opacity-25"
                value={actionFilter}
                onChange={e => setActionFilter(e.target.value)}
              >
                {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <button
            className="btn btn-info text-white border-0 d-flex align-items-center gap-2"
            onClick={handleExport}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-5">
                    <span className="spinner-border text-info" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">No log entries match your search.</td>
                </tr>
              ) : filtered.map(log => {
                const color = actionColors[log.action] || 'secondary';
                return (
                  <tr key={log.id}>
                    <td className="text-muted small font-monospace">
                      {new Date(log.date).toLocaleString()}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-secondary bg-opacity-10 rounded-circle p-1 text-muted">
                          <User size={14} />
                        </div>
                        <span className="fw-bold small">{log.userName}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge bg-${color} bg-opacity-10 text-${color} border border-${color} border-opacity-25 small fw-bold`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="small text-dark">{log.details}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!isLoading && (
          <div className="px-4 py-3 border-top border-secondary border-opacity-10 text-muted small">
            Showing {filtered.length} of {logs.length} log entries
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogPage;
