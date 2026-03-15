import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, trend }) => {
  return (
    <div className="card border-0 shadow-sm rounded-3 p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className={`bg-${color}-subtle text-${color} p-3 rounded-3`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
        </div>
        {trend && (
          <div className={`text-${trend.startsWith('+') ? 'success' : trend === '0' ? 'muted' : 'danger'} small fw-bold d-flex align-items-center gap-1`}>
            <TrendingUp size={14} />
            {trend}
          </div>
        )}
      </div>
      <h3 className="mb-1 fw-bold">{value}</h3>
      <p className="text-muted mb-0 small">{label}</p>
    </div>
  );
};

export default StatCard;
