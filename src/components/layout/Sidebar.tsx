import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Pill, Truck, FileText, LogOut, Cpu, BarChart2, ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [reportsOpen, setReportsOpen] = useState(location.pathname.startsWith('/reports'));

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/products', icon: <Pill size={20} />, label: 'Products' },
    { path: '/suppliers', icon: <Truck size={20} />, label: 'Suppliers' },
    { path: '/purchase-orders', icon: <FileText size={20} />, label: 'Purchase Orders' },
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
                end={item.path === '/'}
              >
                {item.icon}
                <span className="tracking-wide">{item.label}</span>
              </NavLink>
            </li>
          ))}

          <li className="nav-item mt-2">
            <div
              className={`nav-link d-flex align-items-center justify-content-between py-3 px-4 ${location.pathname.startsWith('/reports') ? 'text-info active' : ''}`}
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
                  <NavLink to="/reports/products" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-5 ${isActive ? 'active' : 'text-muted opacity-75'}`}>
                    <span className="tracking-wide">Product Report</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/reports/suppliers" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-5 ${isActive ? 'active' : 'text-muted opacity-75'}`}>
                    <span className="tracking-wide">Supplier Report</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/reports/stock" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-5 ${isActive ? 'active' : 'text-muted opacity-75'}`}>
                    <span className="tracking-wide">Stock Report</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/reports/expiry" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-5 ${isActive ? 'active' : 'text-muted opacity-75'}`}>
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
