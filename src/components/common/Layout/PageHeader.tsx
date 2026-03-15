import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom border-secondary border-opacity-25">
      <div>
        <h1 className="h2 mb-0 fw-bold neon-text">{title}</h1>
        {subtitle && <p className="text-muted small mb-0 mt-1 tracking-wide">{subtitle}</p>}
      </div>
      {actions && (
        <div className="btn-toolbar mb-2 mb-md-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
