import React from 'react';

export const TableSkeleton = () => {
  return (
    <div className="w-100 d-grid gap-3 placeholder-glow">
      <div className="placeholder rounded-3 w-100 bg-secondary bg-opacity-10" style={{ height: '40px' }}></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="placeholder rounded-3 w-100 bg-secondary bg-opacity-10 border border-secondary border-opacity-10" style={{ height: '64px' }}></div>
      ))}
    </div>
  );
};
