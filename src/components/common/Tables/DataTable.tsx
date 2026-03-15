import React from 'react';

interface DataTableProps {
  columns: { key: string; label: string; render?: (item: any) => React.ReactNode; align?: 'start' | 'center' | 'end' }[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, loading, emptyMessage = 'No data found' }) => {
  return (
    <div className="glass-card overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={col.key} 
                  className={`${idx === 0 ? 'ps-4' : ''} ${idx === columns.length - 1 ? 'pe-4' : ''} py-3 text-${col.align || 'start'}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-5">
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-5 text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => (
                <tr key={item.id || rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td 
                      key={`${rowIdx}-${col.key}`} 
                      className={`${colIdx === 0 ? 'ps-4' : ''} ${colIdx === columns.length - 1 ? 'pe-4' : ''} py-3 text-${col.align || 'start'}`}
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
