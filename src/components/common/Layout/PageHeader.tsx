import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end gap-3 mb-5 border-bottom pb-4">
      <div>
        <h1 className="display-5 fw-black text-inherit tracking-tighter m-0 mb-2 fst-italic">
          {title}
        </h1>
        {subtitle && (
          <p className="small fw-bold text-muted lh-sm m-0" style={{ maxWidth: '600px' }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="d-flex align-items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
