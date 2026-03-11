import React, { useState, useEffect } from 'react';
import { Download, Filter, FileText } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../shared/Tables/DataTable';

const ProductsReport = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');

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

    const uniqueCategories = Array.from(new Set(products.map(p => p.category))).sort();

    const filteredData = selectedCategory
        ? products.filter(p => p.category === selectedCategory)
        : products;

    const handleExport = (format: 'csv' | 'pdf') => {
        alert(`Exporting Products Report as ${format.toUpperCase()}...`);
        // Mock export logic
    };

    const columns = [
        { key: 'sku', label: 'SKU' },
        { key: 'name', label: 'Product Name', render: (p: any) => <span className="fw-bold">{p.name}</span> },
        { key: 'category', label: 'Category' },
        { key: 'supplier', label: 'Supplier' },
        { key: 'stock', label: 'Current Stock', render: (p: any) => <span className={p.stock < (p.lowStockThreshold || 50) ? 'text-danger fw-bold' : ''}>{p.stock}</span> },
        { key: 'expiryStatus', label: 'Status' },
    ];

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0 fw-bold neon-text">Products Report</h4>
                    <p className="text-muted small mb-0">Overview of all active molecular entities</p>
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

            <div className="glass-card p-3 mb-4 d-flex align-items-center gap-3">
                <Filter size={16} className="text-info" />
                <span className="fw-bold small text-muted">FILTERS</span>
                <select
                    className="form-select form-select-sm w-auto bg-transparent border-secondary border-opacity-25 text-dark"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            <div className="glass-card border-0">
                <DataTable columns={columns} data={filteredData} loading={loading} />
            </div>
        </div>
    );
};

export default ProductsReport;
