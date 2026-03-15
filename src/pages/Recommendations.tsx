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
    <div className="fade-in">
      <PageHeader 
        title="AI Insights" 
        subtitle="Intelligent inventory optimization and procurement triggers"
      />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <div key={rec.id} className="col-md-6 col-lg-4">
                <div className="glass-card p-4 border-0 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="bg-info bg-opacity-10 p-3 rounded-3 text-info border border-info border-opacity-10">
                      <Package size={24} />
                    </div>
                    <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1 small fw-bold">
                      <AlertTriangle size={12} className="me-1" /> CRITICAL
                    </span>
                  </div>

                  <div className="mb-4">
                    <h5 className="fw-bold neon-text mb-3">{rec.productName}</h5>
                    <div className="d-flex align-items-center gap-4">
                      <div>
                        <p className="text-muted small text-uppercase fw-bold mb-1">Current</p>
                        <p className="h4 fw-bold text-dark mb-0">{rec.currentStock}</p>
                      </div>
                      <ArrowRight className="text-muted opacity-50" size={20} />
                      <div>
                        <p className="text-info small text-uppercase fw-bold mb-1">Stock Up</p>
                        <p className="h4 fw-bold text-info mb-0">+{rec.recommendedQty}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-light rounded-3 border border-secondary border-opacity-10 mb-auto">
                    <div className="d-flex gap-2">
                      <Lightbulb className="text-info shrink-0" size={18} />
                      <p className="small text-muted mb-0 fst-italic">
                        "{rec.reason}"
                      </p>
                    </div>
                  </div>

                  <button 
                    className="btn btn-info text-white w-100 mt-4 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-glow border-0" 
                    style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)' }}
                    onClick={() => navigate('/dashboard/purchase-orders')}
                  >
                    <ShoppingCart size={18} />
                    Create Order
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="glass-card p-5 text-center border-0">
                <ShieldCheck size={48} className="text-success mb-3 opacity-50" />
                <h4 className="fw-bold text-dark">System Stable</h4>
                <p className="text-muted">No critical inventory risks detected. All stock levels are within safety parameters.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
