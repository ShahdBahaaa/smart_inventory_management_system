import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Pill, Truck, FileText, LogOut, Cpu, BarChart2, ChevronDown, ChevronRight, Lightbulb, TrendingUp, PackageCheck, SlidersHorizontal, Settings2, ClipboardCheck, ClipboardList } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [reportsOpen, setReportsOpen] = useState(location.pathname.startsWith('/dashboard/reports'));

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/dashboard/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/dashboard/products', icon: <Pill size={20} />, label: 'Products' },
    { path: '/dashboard/suppliers', icon: <Truck size={20} />, label: 'Suppliers' },
    { path: '/dashboard/purchase-orders', icon: <FileText size={20} />, label: 'Purchase Orders' },
    { path: '/dashboard/recommendations', icon: <Lightbulb size={20} />, label: 'Recommendations' },
    { path: '/dashboard/forecasts', icon: <TrendingUp size={20} />, label: 'Forecasts' },
  ];

  const warehouseItems = [
    { path: '/dashboard/receiving', icon: <PackageCheck size={20} />, label: 'Receive Shipment' },
    { path: '/dashboard/stock-adjustment', icon: <SlidersHorizontal size={20} />, label: 'Stock Adjustment' },
  ];

  const ownerItems = [
    { path: '/dashboard/po-approval', icon: <ClipboardCheck size={20} />, label: 'PO Approval' },
    { path: '/dashboard/audit-log', icon: <ClipboardList size={20} />, label: 'Audit Log' },
    { path: '/dashboard/business-rules', icon: <Settings2 size={20} />, label: 'Business Rules' },
  ];

  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block sidebar collapse">
      <div className="position-sticky pt-3 h-100 d-flex flex-column">
        <div className="px-4 py-4 mb-2 d-flex align-items-center gap-2">
          <div className="bg-info bg-opacity-10 p-2 rounded-3 border border-info border-opacity-25">
            <Cpu size={24} className="text-info" />
          </div>
          <span className="fw-bold fs-5 neon-text">Restockly</span>
        </div>

        <ul className="nav flex-column flex-grow-1">
          {navItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-3 px-4 ${isActive ? 'active' : ''}`}
                end={item.path === '/dashboard'}
              >
                {item.icon}
                <span className="tracking-wide">{item.label}</span>
              </NavLink>
            </li>
          ))}

          {/* Warehouse Section */}
          <li className="nav-item mt-2">
            <p className="small text-uppercase text-muted fw-bold px-4 mb-1" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Warehouse</p>
          </li>
          {warehouseItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-3 px-4 ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span className="tracking-wide">{item.label}</span>
              </NavLink>
            </li>
          ))}

          {/* Owner Section */}
          <li className="nav-item mt-2">
            <p className="small text-uppercase text-muted fw-bold px-4 mb-1" style={{ fontSize: '0.65rem', letterSpacing: '1.5px' }}>Owner Controls</p>
          </li>
          {ownerItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-3 px-4 ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span className="tracking-wide">{item.label}</span>
              </NavLink>
            </li>
          ))}

          {/* Reports Section */}
          <li className="nav-item mt-2">
            <div
              className={`nav-link d-flex align-items-center justify-content-between py-3 px-4 ${location.pathname.startsWith('/dashboard/reports') ? 'text-info active' : ''}`}
              onClick={() => setReportsOpen(!reportsOpen)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center gap-3">
                <BarChart2 size={20} />
                <span className="tracking-wide">Reports</span>
              </div>
              {reportsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>

            {reportsOpen && (
              <ul className="nav flex-column">
                <li className="nav-item">
                  <NavLink to="/dashboard/reports/products" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-5 ${isActive ? 'active' : 'text-muted opacity-75'}`}>
                    <span className="tracking-wide">Product Report</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/dashboard/reports/suppliers" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-5 ${isActive ? 'active' : 'text-muted opacity-75'}`}>
                    <span className="tracking-wide">Supplier Report</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/dashboard/reports/stock" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-5 ${isActive ? 'active' : 'text-muted opacity-75'}`}>
                    <span className="tracking-wide">Stock Report</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/dashboard/reports/expiry" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-5 ${isActive ? 'active' : 'text-muted opacity-75'}`}>
                    <span className="tracking-wide">Expiry Report</span>
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>

        <div className="mt-auto p-4 border-top border-secondary border-opacity-25">
          <NavLink to="/login" className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-3">
            <LogOut size={18} />
            Sign Out
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
