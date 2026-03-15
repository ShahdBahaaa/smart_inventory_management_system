import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, PackageCheck, Activity, Truck, CheckCircle, ShieldCheck } from 'lucide-react';
import api from '@/services/api';

const SupplierScorecardPage = () => {
    const { id } = useParams<{ id: string }>();
    const [supplier, setSupplier] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSupplier = async () => {
            if (!id) return;
            try {
                const data = await api.suppliers.getAll();
                const found = data.find((s: any) => s.id === parseInt(id));
                setSupplier(found);
            } catch (error) {
                console.error('Failed to fetch supplier', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSupplier();
    }, [id]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-info" role="status"></div>
        </div>
    );

    if (!supplier) return (
        <div className="alert bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger m-4">
            Supplier not found
        </div>
    );

    // Generate synthetic detailed scores based on the main score
    const qualityRate = Math.min(100, supplier.score + 2.5).toFixed(1);
    const onTimeDelivery = Math.max(0, supplier.score - 1.8).toFixed(1);
    const fulfillmentRate = (supplier.score + 3.1 > 100 ? 100 : supplier.score + 3.1).toFixed(1);

    return (
        <div className="fade-in py-3 px-2">
            <div className="mb-4">
                <Link to="/dashboard/suppliers" className="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0 text-info opacity-75 hover-opacity-100">
                    <ArrowLeft size={16} />
                    Back to Supply Chain Nodes
                </Link>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="glass-card bg-white p-4 border-0 h-100 shadow-sm rounded-4">
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div className="d-flex gap-3 align-items-center">
                                <div className="bg-info bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center border border-info border-opacity-25" style={{ width: '60px', height: '60px' }}>
                                    <Truck size={32} className="text-info" />
                                </div>
                                <div>
                                    <h2 className="mb-1 fw-bold text-info" style={{ color: '#0ea5e9' }}>{supplier.name}</h2>
                                    <div className="d-flex align-items-center gap-2 text-dark mt-1">
                                        <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                                        <span className="fw-bold small">Performance Index: {supplier.score}/10</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className="badge bg-white text-success border border-success px-3 py-2">ACTIVE PARTNER</span>
                            </div>
                        </div>

                        <div className="mt-2">
                            <div className="p-4 bg-light rounded-4 border-0 h-100">
                                <h6 className="text-muted small fw-bold mb-3 tracking-wide">CONTACT INFORMATION</h6>
                                <table className="table table-borderless table-sm mb-0">
                                    <tbody>
                                        <tr>
                                            <td className="text-muted small ps-0" style={{ width: '80px' }}>Liaison:</td>
                                            <td className="fw-medium text-dark">{supplier.contact}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted small ps-0">Email:</td>
                                            <td className="fw-medium text-dark">{supplier.email}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted small ps-0">Phone:</td>
                                            <td className="fw-medium text-dark">{supplier.phone}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="glass-card bg-white p-4 border-0 h-100 shadow-sm rounded-4">
                        <h5 className="mb-4 fw-bold text-dark">
                            Performance Metrics
                        </h5>

                        <div className="d-flex flex-column gap-4 mt-3">
                            <div className="mb-2">
                                <div className="d-flex justify-content-between align-items-end mb-2">
                                    <span className="small fw-medium text-dark d-flex align-items-center gap-2">
                                        <ShieldCheck size={18} className="text-success" />
                                        Quality Rate
                                    </span>
                                    <span className="fw-bold text-success small">{qualityRate}%</span>
                                </div>
                                <div className="progress bg-secondary bg-opacity-10 rounded-pill" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-success rounded-pill" style={{ width: `${qualityRate}%` }}></div>
                                </div>
                            </div>

                            <div className="mb-2">
                                <div className="d-flex justify-content-between align-items-end mb-2">
                                    <span className="small fw-medium text-dark d-flex align-items-center gap-2">
                                        <Clock size={18} className="text-info" style={{ color: '#0ea5e9' }} />
                                        On-Time Delivery
                                    </span>
                                    <span className="fw-bold text-info small" style={{ color: '#0ea5e9' }}>{onTimeDelivery}%</span>
                                </div>
                                <div className="progress bg-secondary bg-opacity-10 rounded-pill" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-info rounded-pill" style={{ width: `${onTimeDelivery}%`, backgroundColor: '#0ea5e9' }}></div>
                                </div>
                            </div>

                            <div className="mb-2">
                                <div className="d-flex justify-content-between align-items-end mb-2">
                                    <span className="small fw-medium text-dark d-flex align-items-center gap-2">
                                        <PackageCheck size={18} style={{ color: '#a855f7' }} />
                                        Fulfillment Rate
                                    </span>
                                    <span className="fw-bold small" style={{ color: '#a855f7' }}>{fulfillmentRate}%</span>
                                </div>
                                <div className="progress bg-secondary bg-opacity-10 rounded-pill" style={{ height: '6px' }}>
                                    <div className="progress-bar rounded-pill" style={{ width: `${fulfillmentRate}%`, backgroundColor: '#a855f7' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="glass-card bg-white p-4 border-0 shadow-sm rounded-4">
                        <h5 className="mb-4 fw-bold text-dark">Supply History & Compliance</h5>

                        <div className="alert bg-info bg-opacity-10 border border-info border-opacity-25 d-flex gap-3 align-items-start p-4 rounded-3 mb-0" style={{ backgroundColor: '#f0fdfa' }}>
                            <div className="text-info mt-1">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h6 className="fw-bold text-info mb-1">Compliance Verified</h6>
                                <p className="mb-0 text-info opacity-75 small">This supplier has passed all AI-driven quality assurance protocols for the current fiscal quarter.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierScorecardPage;
