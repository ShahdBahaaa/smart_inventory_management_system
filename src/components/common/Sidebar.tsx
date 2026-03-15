import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Pill, Truck, FileText, Lightbulb, TrendingUp, 
  PackageCheck, SlidersHorizontal, ClipboardCheck, ClipboardList, Activity, BarChart2, 
  ChevronDown, ChevronRight, LogOut, Cpu
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [reportsOpen, setReportsOpen] = useState(location.pathname.includes('/reports'));

  useEffect(() => {
    if (location.pathname.includes('/reports')) {
      setReportsOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to) && !to.includes('/reports'));
    return (
      <NavLink
        to={to}
        className="d-flex align-items-center text-decoration-none"
        style={{
          color: isActive ? '#0ea5e9' : '#64748b',
          backgroundColor: isActive ? '#e0f2fe' : 'transparent',
          borderLeft: isActive ? '4px solid #0ea5e9' : '4px solid transparent',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
          padding: '12px 16px 12px 20px',
          fontWeight: 500,
          marginBottom: '4px',
          marginRight: '16px',
          transition: 'all 0.2s',
          fontSize: '0.95rem'
        }}
      >
        <Icon size={20} className="me-3" strokeWidth={isActive ? 2.5 : 2} />
        {label}
      </NavLink>
    );
  };

  const isReportsActive = location.pathname.includes('/reports');

  return (
    <div className="d-flex flex-column bg-white border-end border-secondary border-opacity-10 flex-shrink-0 vh-100" style={{ width: '280px', overflowY: 'auto', zIndex: 1040 }}>
      
      {/* Restockly Logo */}
      <div className="d-flex align-items-center mb-4 mt-4 px-4 flex-shrink-0">
        <div className="bg-info bg-opacity-10 d-flex justify-content-center align-items-center rounded-3 me-3" style={{ width: '40px', height: '40px', border: '1px solid #7dd3fc' }}>
          <Cpu size={24} className="text-info" style={{ color: '#0ea5e9' }} />
        </div>
        <span className="fs-4 fw-bold" style={{ color: '#0ea5e9' }}>Restockly</span>
      </div>

      <div className="flex-grow-1 flex-shrink-0">
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/dashboard/users" icon={Users} label="Users" />
        <NavItem to="/dashboard/products" icon={Pill} label="Products" />
        <NavItem to="/dashboard/suppliers" icon={Truck} label="Suppliers" />
        <NavItem to="/dashboard/purchase-orders" icon={FileText} label="Purchase Orders" />
        <NavItem to="/dashboard/recommendations" icon={Lightbulb} label="Recommendations" />
        <NavItem to="/dashboard/forecasts" icon={TrendingUp} label="Forecasts" />

        <div className="px-4 mt-4 mb-2 fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px', color: '#475569' }}>WAREHOUSE</div>
        <NavItem to="/dashboard/receiving" icon={PackageCheck} label="Receive Shipment" />
        <NavItem to="/dashboard/stock-adjustment" icon={SlidersHorizontal} label="Stock Adjustment" />

        <div className="px-4 mt-4 mb-2 fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px', color: '#475569' }}>OWNER CONTROLS</div>
        <NavItem to="/dashboard/po-approval" icon={ClipboardCheck} label="PO Approval" />
        <NavItem to="/dashboard/audit-log" icon={ClipboardList} label="Audit Log" />
        <NavItem to="/dashboard/business-rules" icon={Activity} label="Business Rules" />

        {/* Reports Dropdown */}
        <div>
          <button 
            onClick={() => setReportsOpen(!reportsOpen)}
            className="w-100 border-0 bg-transparent text-start d-flex align-items-center justify-content-between"
            style={{
              color: isReportsActive ? '#0ea5e9' : '#64748b',
              backgroundColor: isReportsActive && !reportsOpen ? '#e0f2fe' : 'transparent',
              borderLeft: isReportsActive && !reportsOpen ? '4px solid #0ea5e9' : '4px solid transparent',
              borderTopRightRadius: '8px',
              borderBottomRightRadius: '8px',
              padding: '12px 16px 12px 20px',
              fontWeight: 500,
              marginRight: '16px',
              fontSize: '0.95rem'
            }}
          >
            <div className="d-flex align-items-center">
              <BarChart2 size={20} className="me-3" strokeWidth={isReportsActive ? 2.5 : 2} />
              Reports
            </div>
            {reportsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {reportsOpen && (
            <div className="mt-2 mb-3 d-flex flex-column gap-3" style={{ paddingLeft: '60px' }}>
              <NavLink to="/dashboard/reports/products" className="text-decoration-none" style={({isActive}) => ({ color: isActive ? '#0ea5e9' : '#94a3b8', fontSize: '0.95rem' })}>Product Report</NavLink>
              <NavLink to="/dashboard/reports/suppliers" className="text-decoration-none" style={({isActive}) => ({ color: isActive ? '#0ea5e9' : '#94a3b8', fontSize: '0.95rem' })}>Supplier Report</NavLink>
              <NavLink to="/dashboard/reports/stock" className="text-decoration-none" style={({isActive}) => ({ color: isActive ? '#0ea5e9' : '#94a3b8', fontSize: '0.95rem' })}>Stock Report</NavLink>
              <NavLink to="/dashboard/reports/expiry" className="text-decoration-none" style={({isActive}) => ({ color: isActive ? '#0ea5e9' : '#94a3b8', fontSize: '0.95rem' })}>Expiry Report</NavLink>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 mt-auto flex-shrink-0">
        <button 
          onClick={handleLogout}
          className="btn w-100 d-flex align-items-center justify-content-center gap-2 rounded-4 py-2"
          style={{
            border: '1px solid #ef4444',
            backgroundColor: 'transparent',
            color: '#ef4444',
            transition: 'all 0.2s',
            fontWeight: 500
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
