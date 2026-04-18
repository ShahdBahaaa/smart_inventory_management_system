import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, trend }) => {
  const isPositive = trend?.startsWith('+');
  const isNeutral = trend === '0';

  return (
    <div className="glass-card p-4 h-100 transition-all">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div className="rounded-3 d-flex align-items-center justify-content-center shadow-sm" 
             style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--glass-border)' }}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24, className: 'text-primary' }) : icon}
        </div>
        {trend && (
          <div className={`d-flex align-items-center gap-1 small fw-black text-uppercase tracking-widest px-2 py-1 rounded-2 ${
            isPositive ? 'text-success bg-success bg-opacity-10' : isNeutral ? 'text-secondary bg-light' : 'text-danger bg-danger bg-opacity-10'
          }`} style={{ fontSize: '10px' }}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="small fw-black text-muted text-uppercase tracking-widest mb-1" style={{ fontSize: '10px' }}>{label}</p>
        <h3 className="fs-2 fw-black text-inherit tracking-tighter m-0">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
