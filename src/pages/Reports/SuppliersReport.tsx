import React, { useState, useEffect } from 'react';
import { Download, Filter, FileText } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../shared/Tables/DataTable';

const SuppliersReport = () => {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [minScore, setMinScore] = useState<string>('0');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.suppliers.getAll();
                setSuppliers(data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = suppliers.filter(s => s.score >= parseInt(minScore));

    const handleExport = (format: 'csv' | 'pdf') => {
        alert(`Exporting Suppliers Report as ${format.toUpperCase()}...`);
    };

    const columns = [
        { key: 'name', label: 'Supplier Name', render: (s: any) => <span className="fw-bold">{s.name}</span> },
        { key: 'contact', label: 'Primary Contact' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'score', label: 'Performance Score', render: (s: any) => <span className={`fw-bold ${s.score >= 90 ? 'text-success' : s.score >= 80 ? 'text-info' : 'text-warning'}`}>{s.score}/100</span> },
    ];

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0 fw-bold neon-text">Suppliers Report</h4>
                    <p className="text-muted small mb-0">Performance metrics for distribution nodes</p>
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
                    value={minScore}
                    onChange={(e) => setMinScore(e.target.value)}
                >
                    <option value="0">All Scores</option>
                    <option value="80">Score &ge; 80</option>
                    <option value="90">Score &ge; 90</option>
                </select>
            </div>

            <div className="glass-card border-0">
                <DataTable columns={columns} data={filteredData} loading={loading} />
            </div>
        </div>
    );
};

export default SuppliersReport;
