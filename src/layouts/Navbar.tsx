import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Bell, Pill, Cpu, ShieldAlert } from 'lucide-react';
import SearchInput from '@/components/common/Forms/SearchInput';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [lowStockMeds, setLowStockMeds] = useState<any[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const checkStock = async () => {
      try {
        const products = await api.products.getAll();
        const lowStock = products.filter((m: any) => m.stock < (m.lowStockThreshold || 50));
        setLowStockMeds(lowStock);
      } catch (error) {
        console.error('Failed to check stock', error);
      }
    };
    checkStock();

    // Refresh every 30 seconds
    const interval = setInterval(checkStock, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (query: string) => {
    const products = await api.products.getAll();
    return products.filter((m: any) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.sku.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleResultClick = (medicine: any) => {
    navigate(`/dashboard/products/${medicine.id}`);
  };

  return (
    <header className="navbar navbar-expand-md sticky-top flex-md-nowrap p-0 border-bottom border-secondary border-opacity-10 bg-white" style={{ minHeight: '70px', zIndex: 1030 }}>
      <button className="navbar-toggler position-absolute d-md-none collapsed border-0 ms-3" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
      </button>

      <div className="w-100 d-flex justify-content-between align-items-center px-4">
        <div className="w-50 d-none d-md-block py-2">
          <SearchInput
            placeholder="Search molecular nodes, registry ID..."
            onSearch={handleSearch}
            onResultClick={handleResultClick}
            renderResult={(m) => (
              <div className="d-flex align-items-center gap-2">
                <Pill size={16} className="text-info" />
                <div>
                  <div className="fw-bold small text-dark">{m.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>{m.sku} {'\u2022'} {m.category}</div>
                </div>
              </div>
            )}
          />
        </div>

        <div className="navbar-nav flex-row align-items-center gap-3">
          <div className="nav-item dropdown">
            <div className="position-relative cursor-pointer dropdown-toggle no-caret" data-bs-toggle="dropdown" aria-expanded="false">
              <Bell size={20} className={`text-info opacity-75 hover-opacity-100 ${lowStockMeds.length > 0 ? 'pulse-animation' : ''}`} />
              {lowStockMeds.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-glow" style={{ fontSize: '0.5rem', padding: '0.25em 0.4em' }}>
                  {lowStockMeds.length}
                </span>
              )}
            </div>
            <ul className="dropdown-menu dropdown-menu-end glass-card border-secondary border-opacity-10 shadow-lg mt-2 p-0 overflow-hidden" style={{ width: '300px' }}>
              <li className="px-3 py-2 bg-light border-bottom border-secondary border-opacity-10">
                <span className="fw-bold small text-dark">System Notifications</span>
              </li>
              {lowStockMeds.length === 0 ? (
                <li className="px-3 py-4 text-center">
                  <span className="text-muted small">No critical alerts</span>
                </li>
              ) : (
                lowStockMeds.map(med => (
                  <li key={med.id} className="border-bottom border-secondary border-opacity-5">
                    <Link to={`/dashboard/products/${med.id}`} className="dropdown-item py-3 d-flex align-items-start gap-3 text-wrap">
                      <ShieldAlert size={18} className="text-danger flex-shrink-0 mt-1" />
                      <div>
                        <div className="fw-bold small text-dark">Low Stock Alert</div>
                        <div className="text-muted small">
                          {med.name} is below threshold ({med.stock} units left)
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              )}
              <li className="bg-light">
                <Link to="/dashboard/products" className="dropdown-item py-2 text-center text-info small fw-bold">View All Inventory</Link>
              </li>
            </ul>
          </div>

          <div className="nav-item dropdown">
            <a className="nav-link dropdown-toggle d-flex align-items-center gap-2 border-0" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <div className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center border border-info border-opacity-20 shadow-glow" style={{ width: '32px', height: '32px' }}>
                <User size={18} />
              </div>
              <span className="d-none d-lg-inline text-dark opacity-75 fw-medium">Admin Operator</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end glass-card border-secondary border-opacity-10 shadow-lg mt-2" aria-labelledby="navbarDropdown">
              <li><Link className="dropdown-item py-2 text-dark opacity-75 hover-opacity-100" to="/dashboard/profile">Operator Profile</Link></li>
              <li><Link className="dropdown-item py-2 text-dark opacity-75 hover-opacity-100" to="/dashboard/settings">System Settings</Link></li>
              <li><hr className="dropdown-divider border-secondary border-opacity-10" /></li>
              <li><button onClick={handleLogout} className="dropdown-item py-2 text-danger fw-bold border-0 bg-transparent text-start w-100">Terminate Session</button></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
