import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ 
  title = "No Return Data", 
  description = "", 
  icon 
}: { 
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 text-center border border-dashed rounded-3 bg-light-subtle" style={{ borderStyle: 'dashed !important' }}>
      <div className="rounded-circle bg-light-subtle d-flex align-items-center justify-content-center mb-3 text-muted border shadow-sm" style={{ width: '64px', height: '64px' }}>
        {icon || <PackageOpen size={32} />}
      </div>
      <h3 className="fs-5 fw-bold text-inherit tracking-tight">{title}</h3>
      {description && <p className="small text-muted mt-2 mx-auto" style={{ maxWidth: '380px' }}>{description}</p>}
    </div>
  );
}
