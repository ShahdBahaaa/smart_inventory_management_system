import React, { useState } from 'react';
import { Settings2, ShieldAlert, RefreshCw, Calendar, Save, CheckCircle } from 'lucide-react';
import PageHeader from '@/components/common/Layout/PageHeader';

interface Rule {
  id: string;
  label: string;
  description: string;
  value: number | string;
  unit: string;
  type: 'number' | 'select';
  options?: string[];
  icon: React.ReactNode;
  color: string;
}

const BusinessRulesPage = () => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState<Rule[]>([
    {
      id: 'min_stock', label: 'Minimum Stock Level', description: 'Alert when stock falls below this threshold.',
      value: 50, unit: 'units', type: 'number', icon: <ShieldAlert size={20} />, color: 'danger'
    },
    {
      id: 'safety_stock', label: 'Safety Stock Buffer', description: 'Extra stock kept as a buffer against demand spikes.',
      value: 100, unit: 'units', type: 'number', icon: <ShieldAlert size={20} />, color: 'warning'
    },
    {
      id: 'reorder_qty', label: 'Default Reorder Quantity', description: 'Quantity to order when a reorder is triggered.',
      value: 200, unit: 'units', type: 'number', icon: <RefreshCw size={20} />, color: 'info'
    },
    {
      id: 'supplier_lead_time', label: 'Avg. Supplier Lead Time', description: 'Expected days from PO to delivery.',
      value: 7, unit: 'days', type: 'number', icon: <Calendar size={20} />, color: 'primary'
    },
    {
      id: 'expiry_alert_days', label: 'Expiry Alert Window', description: 'Flag products expiring within this many days.',
      value: 90, unit: 'days', type: 'number', icon: <Calendar size={20} />, color: 'warning'
    },
    {
      id: 'reorder_policy', label: 'Reorder Policy', description: 'Strategy used to trigger automatic reorders.',
      value: 'EOQ', unit: '', type: 'select', options: ['EOQ', 'Fixed Quantity', 'Min-Max', 'Just-in-Time'],
      icon: <RefreshCw size={20} />, color: 'success'
    },
  ]);

  const updateRule = (id: string, newValue: number | string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, value: newValue } : r));
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600)); // simulate API call
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <PageHeader title="Business Rules" subtitle="Configure system-wide inventory policies and operational thresholds" />

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
          <CheckCircle size={18} /> Policies saved successfully. Changes are now active.
        </div>
      )}

      <div className="row g-4">
        {rules.map(rule => (
          <div key={rule.id} className="col-md-6">
            <div className="glass-card p-4 border-0 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className={`bg-${rule.color} bg-opacity-10 text-${rule.color} p-2 rounded-3`}>
                  {rule.icon}
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">{rule.label}</h6>
                  <p className="small text-muted mb-0">{rule.description}</p>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3">
                {rule.type === 'number' ? (
                  <input
                    type="number"
                    className="form-control"
                    value={rule.value as number}
                    onChange={e => updateRule(rule.id, parseInt(e.target.value) || 0)}
                    min={0}
                  />
                ) : (
                  <select
                    className="form-select"
                    value={rule.value as string}
                    onChange={e => updateRule(rule.id, e.target.value)}
                  >
                    {rule.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
                {rule.unit && (
                  <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10 px-3 py-2 text-nowrap">
                    {rule.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 d-flex justify-content-end">
        <button
          className="btn btn-info text-white border-0 px-5 py-2 fw-bold d-flex align-items-center gap-2"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <span className="spinner-border spinner-border-sm" /> : <Save size={18} />}
          Save Business Rules
        </button>
      </div>
    </div>
  );
};

export default BusinessRulesPage;
