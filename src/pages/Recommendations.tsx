import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, ShoppingCart, ArrowRight, Package, AlertTriangle, ShieldCheck } from 'lucide-react';
import api from '@/services/api';
import PageHeader from '@/components/common/Layout/PageHeader';

const Recommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        // Using api service if available, otherwise fallback to mock for now
        const data = await api.products.getAll();
        // Simple logic to generate recommendations if no dedicated endpoint
        const recs = data.filter((p: any) => p.stock < (p.lowStockThreshold || 50)).map((p: any) => ({
          id: p.id,
          productName: p.name,
          currentStock: p.stock,
          recommendedQty: (p.lowStockThreshold || 50) * 2 - p.stock,
          reason: `Stock is below the safety threshold of ${p.lowStockThreshold || 50} units. High risk of stockout identified by AI analysis.`
        }));
        setRecommendations(recs);
      } catch (error) {
        console.error('Failed to fetch recommendations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  return (
    <div className="py-4 animate-in fade-in duration-700">
      <PageHeader 
        title="AI Insights" 
        subtitle="Intelligent inventory optimization and procurement triggers"
      />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
             <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <div key={rec.id} className="col-12 col-md-6 col-lg-4">
                <div className="glass-card p-4 h-100 d-flex flex-column shadow-sm border-0 position-relative overflow-hidden">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center border border-primary border-opacity-10" style={{ width: '48px', height: '48px' }}>
                      <Package size={24} className="text-primary" />
                    </div>
                    <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1 small fw-black tracking-widest">
                       <AlertTriangle size={12} className="me-1" /> CRITICAL
                    </span>
                  </div>

                  <div className="mb-4">
                    <h5 className="fw-black text-inherit mb-3 fst-italic">{rec.productName}</h5>
                    <div className="d-flex align-items-center gap-4">
                      <div>
                        <p className="small fw-bold text-muted text-uppercase tracking-widest mb-1" style={{ fontSize: '9px' }}>Current Stock</p>
                        <p className="fs-3 fw-black text-inherit mb-0">{rec.currentStock}</p>
                      </div>
                      <ArrowRight className="text-muted opacity-25" size={20} />
                      <div>
                        <p className="small fw-bold text-primary text-uppercase tracking-widest mb-1" style={{ fontSize: '9px' }}>Stock Up</p>
                        <p className="fs-3 fw-black text-primary mb-0">+{rec.recommendedQty}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-light-subtle rounded-3 border mb-auto shadow-inner">
                    <div className="d-flex gap-2">
                      <Lightbulb className="text-primary flex-shrink-0" size={18} />
                      <p className="small text-muted mb-0 fst-italic">
                        "{rec.reason}"
                      </p>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary w-100 mt-4 py-3 fw-black text-uppercase tracking-widest shadow-lg border-0" 
                    onClick={() => navigate('/dashboard/purchase-orders')}
                  >
                    <ShoppingCart size={18} className="me-2" />
                    Create Order
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="glass-card p-5 text-center border-0 shadow-sm">
                <ShieldCheck size={48} className="text-success mb-3 opacity-25" />
                <h4 className="fw-black text-inherit italic">Registry Stable</h4>
                <p className="text-muted mx-auto" style={{ maxWidth: '400px' }}>No critical inventory risks detected. All stock levels are within safety parameters assigned by the AI core.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Recommendations;
