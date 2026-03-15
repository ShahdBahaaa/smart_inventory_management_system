import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line
} from 'recharts';
import { ForecastData } from '@/types/index';
import { Card } from 'react-bootstrap';

interface ForecastChartProps {
  data: ForecastData[];
}

export default function ForecastChart({ data }: ForecastChartProps) {
  return (
    <Card className="p-4 shadow-sm h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-dark mb-0">Demand Forecast</h5>
        <div className="d-flex gap-3 small">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-1" style={{ width: '12px', height: '12px', backgroundColor: '#7c3aed' }} />
            <span className="text-secondary">Historical</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-1" style={{ width: '12px', height: '12px', backgroundColor: '#34d399' }} />
            <span className="text-secondary">Predicted</span>
          </div>
        </div>
      </div>

      <div style={{ height: '350px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Bar 
              dataKey="historical" 
              name="Historical Demand" 
              fill="#7c3aed" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              name="Predicted Demand" 
              stroke="#34d399" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#34d399', strokeWidth: 2, stroke: '#ffffff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
