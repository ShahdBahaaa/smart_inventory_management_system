import React, { useState, useEffect } from 'react';
import { Download, Filter, FileText, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '@/services/api';
import DataTable from '@/components/common/Tables/DataTable';

const StockReport = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stockFilter, setStockFilter] = useState('all'); // 'all', 'low', 'out'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.products.getAll();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = products.filter(p => {
        const isLow = p.stock < (p.lowStockThreshold || 50) && p.stock > 0;
        const isOut = p.stock === 0;

        if (stockFilter === 'low') return isLow;
        if (stockFilter === 'out') return isOut;
        return true;
    });

    const handleExport = (format: 'csv' | 'pdf') => {
        if (format === 'pdf') {
            const doc = new jsPDF();
            doc.text("Stock Levels Report", 14, 15);
            autoTable(doc, {
                head: [['SKU', 'Product Name', 'Current Stock', 'Reorder Level', 'Status']],
                body: filteredData.map(p => {
                    const isLow = p.stock < (p.lowStockThreshold || 50) && p.stock > 0;
                    const isOut = p.stock === 0;
                    let status = 'OPTIMAL';
                    if (isOut) status = 'OUT OF STOCK';
                    else if (isLow) status = 'LOW STOCK';
                    return [p.sku, p.name, p.stock.toString(), (p.lowStockThreshold || 50).toString(), status];
                }),
                startY: 20,
            });
            doc.save('stock-report.pdf');
        } else {
            alert(`Exporting Stock Report as ${format.toUpperCase()}...`);
        }
    };

    const columns = [
        { key: 'sku', label: 'SKU' },
        { key: 'name', label: 'Product Name', render: (p: any) => <span className="fw-bold">{p.name}</span> },
        { key: 'stock', label: 'Current Stock', render: (p: any) => <span className={`fw-bold ${p.stock === 0 ? 'text-danger' : 'text-dark'}`}>{p.stock}</span> },
        { key: 'lowStockThreshold', label: 'Reorder Level', render: (p: any) => <span className="text-muted">{p.lowStockThreshold || 50}</span> },
        {
            key: 'status',
            label: 'Inventory Status',
            render: (p: any) => {
                const isLow = p.stock < (p.lowStockThreshold || 50) && p.stock > 0;
                const isOut = p.stock === 0;
                if (isOut) return <span className="badge badge-danger">OUT OF STOCK</span>;
                if (isLow) return <span className="badge badge-warning pulse-animation">LOW STOCK</span>;
                return <span className="badge badge-valid">OPTIMAL</span>;
            }
        },
    ];

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0 fw-bold neon-text">Stock Levels Report</h4>
                    <p className="text-muted small mb-0">Inventory threshold and depletion analysis</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-info btn-sm d-flex align-items-center gap-2" onClick={() => handleExport('csv')}>
                        <Download size={14} /> Export CSV
                    </button>
                    <button className="btn btn-info text-white btn-sm d-flex align-items-center gap-2 border-0 shadow-glow" onClick={() => handleExport('pdf')}>
                        <FileText size={14} /> Export PDF
                    </button>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12">
                    <div className="glass-card p-3 d-flex align-items-center gap-3">
                        <Filter size={16} className="text-info" />
                        <span className="fw-bold small text-muted">STOCK FILTER</span>
                        <select
                            className="form-select form-select-sm w-auto bg-transparent border-secondary border-opacity-25 text-dark"
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                        >
                            <option value="all">All Inventory</option>
                            <option value="low">Low Stock (Below Reorder Level)</option>
                            <option value="out">Out of Stock (Zero Inventory)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-card border-0">
                <DataTable columns={columns} data={filteredData} loading={loading} />
            </div>
        </div>
    );
};

export default StockReport;
