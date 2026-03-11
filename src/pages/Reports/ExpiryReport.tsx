import React, { useState, useEffect } from 'react';
import { Download, Filter, FileText } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../shared/Tables/DataTable';

const ExpiryReport = () => {
    const [batches, setBatches] = useState<any[]>([]);
    const [productsMap, setProductsMap] = useState<Record<number, any>>({});
    const [loading, setLoading] = useState(true);
    const [expiryFilter, setExpiryFilter] = useState('all'); // 'all', 'expired', 'soon'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsData = await api.products.getAll();
                const pMap: Record<number, any> = {};
                productsData.forEach((p: any) => { pMap[p.id] = p; });
                setProductsMap(pMap);

                // Fetching batches directly isn't an exposed primitive in mock API, 
                // so we fetch a few products to extract their batches
                const product1 = await api.products.getById(1);
                const product3 = await api.products.getById(3);
                const product4 = await api.products.getById(4);

                const allBatches = [...(product1.batches || []), ...(product3.batches || []), ...(product4.batches || [])];
                setBatches(allBatches);

            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = batches.filter(b => {
        const today = new Date();
        const expiry = new Date(b.expiryDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const isExpired = expiry < today;
        const isExpiringSoon = expiry >= today && expiry <= thirtyDaysFromNow;

        if (expiryFilter === 'expired') return isExpired;
        if (expiryFilter === 'soon') return isExpiringSoon;
        return true;
    });

    const handleExport = (format: 'csv' | 'pdf') => {
        alert(`Exporting Expiry Report as ${format.toUpperCase()}...`);
    };

    const columns = [
        { key: 'lotNumber', label: 'Batch/Lot Number', render: (b: any) => <span className="fw-bold">{b.lotNumber}</span> },
        { key: 'product', label: 'Product Name', render: (b: any) => <span>{productsMap[b.productId]?.name || 'Unknown Product'}</span> },
        { key: 'quantity', label: 'Units Affected', render: (b: any) => <span>{b.quantity}</span> },
        {
            key: 'expiryDate', label: 'Expiry Date', render: (b: any) => {
                const isExpired = new Date(b.expiryDate) < new Date();
                return <span className={isExpired ? 'text-danger fw-bold' : ''}>{new Date(b.expiryDate).toLocaleDateString()}</span>;
            }
        },
        {
            key: 'status',
            label: 'Stability Status',
            render: (b: any) => {
                const today = new Date();
                const expiry = new Date(b.expiryDate);
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(today.getDate() + 30);

                if (expiry < today) return <span className="badge badge-danger">EXPIRED</span>;
                if (expiry <= thirtyDaysFromNow) return <span className="badge badge-warning pulse-animation">EXPIRING SOON</span>;
                return <span className="badge badge-valid">VALID</span>;
            }
        },
    ];

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0 fw-bold neon-text">Expiry Stability Report</h4>
                    <p className="text-muted small mb-0">Track shelf-life and expiration risks across batches</p>
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
                    value={expiryFilter}
                    onChange={(e) => setExpiryFilter(e.target.value)}
                >
                    <option value="all">All Batches</option>
                    <option value="soon">Expiring within 30 days</option>
                    <option value="expired">Already Expired</option>
                </select>
            </div>

            <div className="glass-card border-0">
                <DataTable columns={columns} data={filteredData} loading={loading} />
            </div>
        </div>
    );
};

export default ExpiryReport;
