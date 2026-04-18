import React from 'react';
import ForecastChart from '@/components/common/ForecastChart';
import { mockForecastData } from '@/services/mockData';
import { TrendingUp, Calendar, Info } from 'lucide-react';
import { Row, Col, Card } from 'react-bootstrap';

export default function ForecastsPage() {
  return (
    <div className="py-4 animate-in fade-in duration-700">
      <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-5 gap-4">
        <PageHeader 
          title="Demand Forecasting" 
          subtitle="Predict future demand based on historical trends and seasonal patterns."
        />
        <div className="d-flex align-items-center gap-2 bg-light-subtle border px-3 py-2 rounded-3 text-muted small shadow-sm">
          <Calendar size={16} />
          <span className="fw-bold text-uppercase tracking-widest" style={{ fontSize: '10px' }}>Next 3 Months</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="glass-card p-0 overflow-hidden h-100 shadow-sm border-0">
            <ForecastChart data={mockForecastData} />
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="glass-card p-4 p-lg-5 h-100 d-flex flex-column shadow-sm">
            <h5 className="fw-bold text-inherit mb-4 d-flex align-items-center gap-2 italic">
               <TrendingUp className="text-primary" size={20} />
               Forecast Summary
            </h5>
            <div className="d-grid gap-2">
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light-subtle">
                <span className="small fw-bold text-muted text-uppercase tracking-widest" style={{ fontSize: '10px' }}>Predicted Growth</span>
                <span className="text-primary fw-black fs-5 fst-italic">+12.5%</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light-subtle">
                <span className="small fw-bold text-muted text-uppercase tracking-widest" style={{ fontSize: '10px' }}>Confidence Level</span>
                <span className="text-info fw-black fs-5">88%</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3">
                <span className="small fw-bold text-muted text-uppercase tracking-widest" style={{ fontSize: '10px' }}>Peak Demand Month</span>
                <span className="text-inherit fw-black fs-5">June</span>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <div className="p-3 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 d-flex gap-3">
                <Info className="text-primary flex-shrink-0" size={20} />
                <p className="small text-muted mb-0 fst-italic">
                  Our model uses Exponential Smoothing to provide accurate predictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
