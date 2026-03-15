import React from 'react';
import { Package, ArrowDownCircle, TrendingDown, Info } from 'lucide-react';
import { EOQData } from '@/types/index';
import { Card, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

interface EOQCardProps {
  data: EOQData;
}

export default function EOQCard({ data }: EOQCardProps) {
  return (
    <Card className="p-4 shadow-sm h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <Package className="text-primary" size={20} />
          Inventory Optimization (EOQ)
        </h5>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Economic Order Quantity minimizes total inventory costs.</Tooltip>}
        >
          <Button variant="link" className="text-secondary p-0">
            <Info size={18} />
          </Button>
        </OverlayTrigger>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <div className="p-3 rounded bg-light border border-secondary border-opacity-25 h-100">
            <p className="small fw-bold text-secondary text-uppercase tracking-wider mb-2">Optimal Order Qty</p>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="fw-bold text-dark mb-0">{data.optimalOrderQty}</h3>
              <span className="small text-secondary">units</span>
            </div>
          </div>
        </Col>

        <Col md={4}>
          <div className="p-3 rounded bg-light border border-secondary border-opacity-25 h-100 position-relative overflow-hidden">
            <p className="small fw-bold text-secondary text-uppercase tracking-wider mb-2">Reorder Point (ROP)</p>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="fw-bold text-warning mb-0">{data.reorderPoint}</h3>
              <span className="small text-secondary">units</span>
            </div>
            <ArrowDownCircle className="position-absolute text-warning opacity-10" style={{ right: '-10px', bottom: '-10px' }} size={60} />
          </div>
        </Col>

        <Col md={4}>
          <div className="p-3 rounded bg-primary bg-opacity-10 border border-primary border-opacity-25 h-100 position-relative overflow-hidden">
            <p className="small fw-bold text-primary text-uppercase tracking-wider mb-2">Est. Annual Savings</p>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="fw-bold text-primary mb-0">${data.estimatedSavings.toLocaleString()}</h3>
            </div>
            <TrendingDown className="position-absolute text-primary opacity-10" style={{ right: '-10px', bottom: '-10px' }} size={60} />
          </div>
        </Col>
      </Row>

      <div className="small text-secondary bg-light p-3 rounded border border-secondary border-opacity-10">
        EOQ is calculated based on annual demand, ordering costs, and holding costs to minimize total inventory expenses.
      </div>
    </Card>
  );
}
