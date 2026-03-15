import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, Package, DollarSign, Truck, ArrowLeft, 
  Plus, Search, ShieldCheck, Star, Activity, ClipboardList, Archive
} from 'lucide-react';
import PageHeader from '@/components/common/Layout/PageHeader';
import { usePO } from '@/store/POContext';

// Mock Data
const mockSuppliers = [
  { id: 'SUP-001', name: 'Global Pharma Solutions', score: 96, onTime: '98%', quality: '99%' },
  { id: 'SUP-002', name: 'MedEquip Direct', score: 88, onTime: '90%', quality: '92%' },
  { id: 'SUP-003', name: 'BioTech Industries', score: 79, onTime: '75%', quality: '85%' },
];

const mockProducts = [
  { id: 'PRD-001', name: 'Amoxicillin 500mg', sku: 'AMX-500', stock: 45, suggestedQty: 500, price: 12.50 },
  { id: 'PRD-002', name: 'Ibuprofen 400mg', sku: 'IBU-400', stock: 12, suggestedQty: 1000, price: 5.75 },
  { id: 'PRD-003', name: 'Lisinopril 10mg', sku: 'LIS-10', stock: 200, suggestedQty: 300, price: 15.00 },
];

export default function POFormPage() {
  const navigate = useNavigate();
  const { addOrder } = usePO();
  const [step, setStep] = useState(1);
  const [supplierId, setSupplierId] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const supplier = mockSuppliers.find(s => s.id === supplierId);

  const handleSelectProduct = (product: any) => {
    if (!selectedItems.find(i => i.id === product.id)) {
      setSelectedItems([...selectedItems, { ...product, orderQty: product.suggestedQty }]);
    }
  };

  const handleUpdateItem = (id: string, field: string, value: number) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return selectedItems.reduce((acc, item) => acc + (item.orderQty * item.price), 0);
  };

  const handleSubmit = () => {
    const total = calculateSubtotal();
    const newPO = { 
      id: `PO-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`, 
      supplier: supplier?.name || supplierId,
      status: 'DRAFT',
      date: new Date().toISOString().split('T')[0],
      total 
    };
    addOrder(newPO);
    navigate('/dashboard/purchase-orders');
  };

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fade-in pb-5">
      <button className="btn btn-link text-info text-decoration-none p-0 mb-3 d-flex align-items-center gap-2 px-3 fw-bold" onClick={() => navigate('/dashboard/purchase-orders')}>
        <ArrowLeft size={18} /> Back to Purchase Orders
      </button>

      <PageHeader
        title="Create Purchase Order"
        subtitle="Generate a new procurement request with multi-step validation"
      />

      {/* Progress Indicator */}
      <div className="glass-card mb-4 p-4 border-0 rounded-3 shadow-sm position-relative overflow-hidden" style={{ background: '#fff' }}>
        <div className="d-flex justify-content-between text-center position-relative z-1">
          <div className={`flex-fill ${step >= 1 ? 'text-info fw-bold' : 'text-muted opacity-50'}`}>
            <Truck size={24} className="mb-2 d-block mx-auto" />
            <span className="small">1. Supplier</span>
          </div>
          <div className={`flex-fill ${step >= 2 ? 'text-info fw-bold' : 'text-muted opacity-50'}`}>
            <Search size={24} className="mb-2 d-block mx-auto" />
            <span className="small">2. Add Items</span>
          </div>
          <div className={`flex-fill ${step >= 3 ? 'text-info fw-bold' : 'text-muted opacity-50'}`}>
            <Package size={24} className="mb-2 d-block mx-auto" />
            <span className="small">3. Quantities</span>
          </div>
          <div className={`flex-fill ${step >= 4 ? 'text-info fw-bold' : 'text-muted opacity-50'}`}>
            <ClipboardList size={24} className="mb-2 d-block mx-auto" />
            <span className="small">4. Review</span>
          </div>
        </div>
        <div className="position-absolute top-50 start-0 w-100" style={{ height: '2px', background: '#e9ecef', zIndex: 0, marginTop: '-12px' }}>
          <div className="bg-info h-100 transition-all" style={{ width: `${(step - 1) * 33.33}%` }}></div>
        </div>
      </div>

      <div className="glass-card p-4 border-0 shadow-sm rounded-4 bg-white" style={{ minHeight: '400px' }}>
        
        {/* STEP 1: SELECT SUPPLIER */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
              <div className="bg-info bg-opacity-10 p-2 rounded-circle text-info">
                <Truck size={20} />
              </div>
              Select Vendor
            </h4>
            
            <div className="mb-4" style={{ maxWidth: '600px' }}>
              <label className="form-label text-muted fw-bold small tracking-wider">SUPPLIER</label>
              <select className="form-select border-secondary border-opacity-25 py-2 shadow-sm" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                <option value="">Select a vetted supplier...</option>
                {mockSuppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {supplier && (
              <div className="card border-info border-opacity-25 bg-info bg-opacity-10 mb-5 shadow-sm" style={{ maxWidth: '600px', borderRadius: '12px' }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                      <ShieldCheck className="text-info" size={20} /> {supplier.name}
                    </h5>
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill fw-bold">
                      VERIFIED
                    </span>
                  </div>
                  <div className="row g-3">
                    <div className="col-4">
                      <p className="text-muted small fw-bold mb-1">SCORE</p>
                      <h4 className="text-info fw-bold mb-0">{supplier.score}%</h4>
                    </div>
                    <div className="col-4">
                      <p className="text-muted small fw-bold mb-1">ON-TIME</p>
                      <h5 className="text-dark fw-bold mb-0">{supplier.onTime}</h5>
                    </div>
                    <div className="col-4">
                      <p className="text-muted small fw-bold mb-1">QUALITY</p>
                      <h5 className="text-dark fw-bold mb-0">{supplier.quality}</h5>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button 
              className="btn fw-bold px-5 text-white shadow-glow d-flex align-items-center gap-2" 
              style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)', border: 'none', borderRadius: '8px', padding: '12px 24px' }}
              disabled={!supplierId}
              onClick={() => setStep(2)}
            >
              Next Step
            </button>
          </div>
        )}

        {/* STEP 2: ADD ITEMS */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-dark d-flex align-items-center gap-2 m-0">
                <div className="bg-info bg-opacity-10 p-2 rounded-circle text-info">
                  <Search size={20} />
                </div>
                Search & Add Products
              </h4>
              <span className="badge bg-dark bg-opacity-10 text-dark border border-dark border-opacity-10 px-3 py-2 rounded-pill fw-bold">
                {selectedItems.length} Items Selected
              </span>
            </div>

            <div className="input-group mb-4 shadow-sm" style={{ maxWidth: '600px' }}>
              <span className="input-group-text bg-white border-secondary border-opacity-25">
                <Search size={18} className="text-muted" />
              </span>
              <input 
                type="text" 
                className="form-control border-secondary border-opacity-25 py-2" 
                placeholder="Search by product name or SKU..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="table-responsive border rounded-3 mb-4 border-secondary border-opacity-10 shadow-sm overflow-hidden">
              <table className="table table-hover mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="text-muted small fw-bold">PRODUCT</th>
                    <th className="text-muted small fw-bold text-center">CURRENT STOCK</th>
                    <th className="text-muted small fw-bold text-center">SUGGESTED QTY</th>
                    <th className="text-muted small fw-bold text-end">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const isSelected = selectedItems.find(i => i.id === product.id);
                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="fw-bold text-dark">{product.name}</div>
                          <div className="small text-muted">{product.sku}</div>
                        </td>
                        <td className="text-center">
                          <span className={`badge px-2 py-1 rounded-pill ${product.stock < 50 ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25' : 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'}`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="text-center fw-bold text-info">{product.suggestedQty}</td>
                        <td className="text-end">
                          <button 
                            className={`btn btn-sm fw-bold d-inline-flex align-items-center gap-1 ${isSelected ? 'btn-light text-success' : 'btn-outline-info'}`}
                            onClick={() => handleSelectProduct(product)}
                            disabled={!!isSelected}
                          >
                            {isSelected ? <><Check size={14} /> Added</> : <><Plus size={14} /> Add</>}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="d-flex gap-3 pt-3 border-top border-secondary border-opacity-10">
              <button className="btn btn-light fw-bold px-4 border" onClick={() => setStep(1)}>Back</button>
              <button 
                className="btn fw-bold px-5 text-white shadow-glow" 
                style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)', border: 'none', borderRadius: '8px' }}
                onClick={() => setStep(3)}
                disabled={selectedItems.length === 0}
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: QUANTITIES & PRICES */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h4 className="fw-bold text-dark d-flex align-items-center gap-2 mb-4">
              <div className="bg-info bg-opacity-10 p-2 rounded-circle text-info">
                <Package size={20} />
              </div>
              Define Quantities & Prices
            </h4>

            <div className="d-flex flex-column gap-3 mb-4">
              {selectedItems.map((item) => (
                <div key={item.id} className="card border-secondary border-opacity-10 shadow-sm bg-light bg-opacity-50">
                  <div className="card-body p-3">
                    <div className="row align-items-center border-bottom border-secondary border-opacity-10 pb-3 mb-3">
                      <div className="col-md-5">
                        <div className="fw-bold text-dark fs-5">{item.name}</div>
                        <div className="small text-muted">{item.sku}</div>
                      </div>
                      <div className="col-md-7 d-flex justify-content-end align-items-center gap-4">
                        <div className="text-end">
                          <span className="small text-muted fw-bold d-block mb-1">CURRENT STOCK</span>
                          <span className="badge bg-secondary bg-opacity-10 text-dark border border-secondary border-opacity-25 px-2 py-1">{item.stock}</span>
                        </div>
                        <div className="text-end border-start ps-4">
                          <span className="small text-muted fw-bold d-block mb-1">SUGGESTED</span>
                          <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2 py-1">{item.suggestedQty}</span>
                        </div>
                      </div>
                    </div>
                    <div className="row g-3 align-items-end">
                      <div className="col-md-3">
                        <label className="form-label text-muted fw-bold small">ORDER QUANTITY</label>
                        <input type="number" min="1" className="form-control border-info fw-bold text-info" style={{ backgroundColor: '#F0FBFF' }} value={item.orderQty} onChange={(e) => handleUpdateItem(item.id, 'orderQty', parseInt(e.target.value) || 1)} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label text-muted fw-bold small">UNIT PRICE ($)</label>
                        <input type="number" step="0.01" min="0" className="form-control" value={item.price} onChange={(e) => handleUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label text-muted fw-bold small">LINE TOTAL</label>
                        <div className="form-control bg-white border-0 fw-bold fs-5 text-dark">${(item.orderQty * item.price).toFixed(2)}</div>
                      </div>
                      <div className="col-md-3 d-flex justify-content-end">
                        <button className="btn btn-outline-danger btn-sm px-4 fw-bold" onClick={() => handleRemoveItem(item.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedItems.length === 0 && (
              <div className="alert bg-warning bg-opacity-10 border-warning border-opacity-25 text-warning fw-bold d-flex align-items-center gap-2">
                <Activity size={18} /> You must add items to proceed.
              </div>
            )}

            <div className="d-flex gap-3 pt-3 border-top border-secondary border-opacity-10">
              <button className="btn btn-light fw-bold px-4 border" onClick={() => setStep(2)}>Back</button>
              <button 
                className="btn fw-bold px-5 text-white shadow-glow" 
                style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)', border: 'none', borderRadius: '8px' }}
                onClick={() => setStep(4)}
                disabled={selectedItems.length === 0}
              >
                Proceed to Review
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h4 className="fw-bold text-dark d-flex align-items-center gap-2 mb-4">
              <div className="bg-info bg-opacity-10 p-2 rounded-circle text-info">
                <ClipboardList size={20} />
              </div>
              Order Review
            </h4>

            <div className="row g-4 mb-4">
              <div className="col-md-8">
                <div className="card shadow-sm border-secondary border-opacity-10 rounded-4">
                  <div className="card-header bg-light py-3 border-0">
                    <h6 className="fw-bold mb-0 text-muted">ORDER SUMMARY</h6>
                  </div>
                  <div className="card-body p-0">
                    <table className="table table-borderless table-hover mb-0">
                      <thead className="bg-light border-bottom text-muted small">
                        <tr>
                          <th className="ps-4">PRODUCT</th>
                          <th className="text-center">QTY</th>
                          <th className="text-end">UNIT PRICE</th>
                          <th className="text-end pe-4">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedItems.map((item, idx) => (
                          <tr key={idx} className="border-bottom border-light">
                            <td className="ps-4 py-3 fw-medium text-dark">{item.name}</td>
                            <td className="text-center py-3">{item.orderQty}</td>
                            <td className="text-end py-3 text-muted">${item.price.toFixed(2)}</td>
                            <td className="text-end pe-4 py-3 fw-bold text-dark">${(item.orderQty * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow-sm border-secondary border-opacity-10 rounded-4 bg-light bg-opacity-50">
                  <div className="card-body p-4">
                    <p className="mb-1 text-muted fw-bold text-uppercase small tracking-wider">VENDOR</p>
                    <h5 className="mb-4 fw-bold text-info d-flex align-items-center gap-2">
                      <Truck size={18} /> {supplier?.name}
                    </h5>
                    
                    <p className="mb-1 text-muted fw-bold text-uppercase small tracking-wider">ORDER STATUS</p>
                    <div className="mb-4">
                      <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-3 py-2 rounded-pill fw-bold">
                        <Archive size={14} className="me-1 d-inline-block" style={{ marginTop: '-2px' }}/> DRAFT
                      </span>
                    </div>
                    
                    <div className="border-top border-secondary border-opacity-10 pt-4 mt-2">
                      <p className="mb-1 text-muted fw-bold text-uppercase small tracking-wider">ESTIMATED TOTAL</p>
                      <h2 className="fw-bold text-dark m-0">${calculateSubtotal().toFixed(2)}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-between pt-4 border-top border-secondary border-opacity-10">
              <button className="btn btn-light fw-bold px-4 border" onClick={() => setStep(3)}>Back</button>
              <button 
                className="btn btn-success fw-bold px-5 d-flex align-items-center gap-2 shadow-glow" 
                style={{ borderRadius: '8px', padding: '12px 24px' }}
                onClick={handleSubmit}
              >
                <Check size={18} /> Submit Purchase Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
