import React from 'react';
import ForecastChart from '@/components/common/ForecastChart';
import { mockForecastData } from '@/services/mockData';
import { TrendingUp, Calendar, Info } from 'lucide-react';
import { Row, Col, Card } from 'react-bootstrap';

export default function ForecastsPage() {
  return (
    <div className="py-4">
      <Row className="align-items-end mb-5">
        <Col>
          <h1 className="display-6 fw-bold text-dark">Demand Forecasting</h1>
          <p className="text-secondary">Predict future demand based on historical trends and seasonal patterns.</p>
        </Col>
        <Col xs="auto">
          <div className="d-flex align-items-center gap-2 bg-light border border-secondary border-opacity-25 px-3 py-2 rounded text-secondary small">
            <Calendar size={16} />
            Next 3 Months
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <ForecastChart data={mockForecastData} />
        </Col>
        
        <Col lg={4}>
          <Card className="p-4 mb-4 shadow-sm h-100">
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <TrendingUp className="text-success" size={20} />
              Forecast Summary
            </h5>
            <div className="space-y-4">
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-secondary border-opacity-10">
                <span className="text-secondary">Predicted Growth</span>
                <span className="text-success fw-bold">+12.5%</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-secondary border-opacity-10">
                <span className="text-secondary">Confidence Level</span>
                <span className="text-primary fw-bold">88%</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3">
                <span className="text-secondary">Peak Demand Month</span>
                <span className="text-dark fw-bold">June</span>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <div className="p-3 rounded bg-info bg-opacity-10 border border-info border-opacity-25 d-flex gap-3">
                <Info className="text-info shrink-0" size={20} />
                <p className="small text-secondary mb-0">
                  Our model uses Exponential Smoothing to provide accurate predictions.
                </p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
