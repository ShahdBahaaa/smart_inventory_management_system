import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  FileText,
  Settings,
  LogOut,
  BrainCircuit,
  ShieldAlert,
  PackageCheck,
  SlidersHorizontal,
  ClipboardCheck,
  ClipboardList,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', exact: true },
    { icon: Package, label: 'Products', path: '/dashboard/products' },
    { icon: Truck, label: 'Suppliers', path: '/dashboard/suppliers' },
    { icon: FileText, label: 'Purchase Orders', path: '/dashboard/purchase-orders' },
    { icon: BrainCircuit, label: 'AI Optimizer Hub', path: '/dashboard/ai-optimizer' },
    { icon: ShieldAlert, label: 'FEFO & Expiry', path: '/dashboard/fefo' },
  ];

  const warehouseItems = [
    { icon: PackageCheck, label: 'Receive Shipment', path: '/dashboard/receiving' },
    { icon: SlidersHorizontal, label: 'Stock Adjustment', path: '/dashboard/stock-adjustment' },
  ];

  const ownerItems = [
    { icon: ClipboardCheck, label: 'PO Approval', path: '/dashboard/po-approval' },
    { icon: ClipboardList, label: 'Audit Log', path: '/dashboard/audit-log' },
    { icon: Activity, label: 'Business Rules', path: '/dashboard/business-rules' },
  ];

  const NavItem = ({ item }: { item: any }) => {
    const isActive = item.exact 
      ? location.pathname === item.path 
      : location.pathname.startsWith(item.path);
      
    return (
      <Link
        to={item.path}
        className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 transition-all text-decoration-none ${
          isActive 
            ? 'active-nav-item' 
            : 'text-secondary hover-bg-light'
        }`}
      >
        <item.icon size={20} className={isActive ? 'text-primary' : 'text-muted transition-colors'} />
        <span className="small fw-bold tracking-tight">{item.label}</span>
        {isActive && (
          <div className="ms-auto rounded-circle bg-primary shadow-sm" style={{ width: '6px', height: '6px' }} />
        )}
      </Link>
    );
  };

  return (
    <aside className="position-fixed start-0 top-0 vh-100 border-end d-flex flex-column z-3 sidebar" style={{ width: '260px' }}>
      <div className="pt-5 px-4 d-flex align-items-start" style={{ height: '96px' }}>
        <Link to="/dashboard" className="d-flex align-items-center gap-3 text-decoration-none">
          <div className="rounded-3 bg-primary d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h2 className="fs-5 fw-black text-inherit tracking-tighter m-0">RESTOCKLY</h2>
            <p className="small fw-bold text-primary tracking-widest m-0" style={{ fontSize: '10px' }}>INTELLIGENCE</p>
          </div>
        </Link>
      </div>

      <nav className="flex-grow-1 px-3 py-2 overflow-y-auto custom-scrollbar">
        <div className="d-grid gap-1">
          {menuItems.map((item) => <NavItem key={item.path} item={item} />)}

          <div className="px-3 mt-4 mb-2 small fw-black text-muted text-uppercase tracking-widest" style={{ fontSize: '10px' }}>Warehouse</div>
          {warehouseItems.map((item) => <NavItem key={item.path} item={item} />)}

          <div className="px-3 mt-4 mb-2 small fw-black text-muted text-uppercase tracking-widest" style={{ fontSize: '10px' }}>Management</div>
          {ownerItems.map((item) => <NavItem key={item.path} item={item} />)}
        </div>
      </nav>

      <div className="p-4 border-top">
        <div className="d-grid gap-2">
          <Link to="/dashboard/profile" className="d-flex align-items-center gap-3 px-3 py-2 text-muted text-decoration-none transition-colors">
            <Settings size={18} />
            <span className="small fw-bold">Profile Settings</span>
          </Link>
          <button 
            type="button"
            onClick={logout}
            className="btn btn-outline-danger d-flex align-items-center gap-3 px-3 py-2 rounded-3 fw-bold text-uppercase border-0 text-start"
            style={{ fontSize: '12px' }}
          >
            <LogOut size={18} />
            <span>LOG OUT</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
