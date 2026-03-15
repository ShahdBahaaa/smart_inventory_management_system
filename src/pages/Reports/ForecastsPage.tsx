import React from 'react';
import ForecastChart from '@/components/common/ForecastChart';
import { TrendingUp, Calendar, Info, BrainCircuit } from 'lucide-react';
import PageHeader from '@/components/common/Layout/PageHeader';

const mockForecastData = [
  { month: 'Jan', historical: 400, predicted: 420 },
  { month: 'Feb', historical: 300, predicted: 310 },
  { month: 'Mar', historical: 500, predicted: 550 },
  { month: 'Apr', historical: 450, predicted: 480 },
  { month: 'May', historical: 600, predicted: 650 },
  { month: 'Jun', historical: null, predicted: 700 },
  { month: 'Jul', historical: null, predicted: 720 },
  { month: 'Aug', historical: null, predicted: 680 },
];

export default function ForecastsPage() {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Predictive Analytics"
        subtitle="AI-driven demand forecasting and market trend analysis"
      />

      <div className="row g-4">
        <div className="col-lg-8">
          <ForecastChart data={mockForecastData} />
        </div>
        
        <div className="col-lg-4">
          <div className="glass-card p-4 h-100 border-0">
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <TrendingUp className="text-success" size={20} />
              Forecast Summary
            </h5>
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-secondary border-opacity-10">
                <span className="text-muted small fw-bold">PREDICTED GROWTH</span>
                <span className="text-success fw-bold">+12.5%</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-secondary border-opacity-10">
                <span className="text-muted small fw-bold">CONFIDENCE LEVEL</span>
                <span className="text-info fw-bold">88.2%</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3">
                <span className="text-muted small fw-bold">PEAK DEMAND</span>
                <span className="text-dark fw-bold">June 2026</span>
              </div>
            </div>

            <div className="p-3 rounded-3 bg-info bg-opacity-10 border border-info border-opacity-10 d-flex gap-3 mt-auto">
              <BrainCircuit className="text-info shrink-0" size={20} />
              <p className="small text-muted mb-0">
                Predictive engines are utilizing LSTM models and seasonal adjustment factors for this category.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
