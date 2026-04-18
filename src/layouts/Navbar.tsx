import React from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const TopBar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');
  const [showNotifications, setShowNotifications] = React.useState(false);

  const notifications = [
    { id: 1, title: 'Low Stock Alert', msg: 'Aspirin High Strength is below threshold', time: '2m ago', type: 'danger' },
    { id: 2, title: 'Expiry Warning', msg: 'Batch B-993 expires in 12 days', time: '1h ago', type: 'warning' },
    { id: 3, title: 'System Restock', msg: 'New purchase order generated for Node-01', time: '3h ago', type: 'info' },
  ];

  React.useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header className="sticky-top z-2 bg-inherit backdrop-blur-xl border-bottom d-flex align-items-start justify-content-between pt-5 px-4" style={{ height: '96px' }}>
      <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ maxWidth: '600px' }}>
        <div className="position-relative flex-grow-1">
          <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Global system search..." 
            className="form-control form-control-sm bg-light-subtle border-0 rounded-3 py-2 ps-5 pe-3 text-inherit shadow-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          />
        </div>
      </div>

      <div className="d-flex align-items-center gap-4 ms-3">
        <div className="d-flex align-items-center gap-2 border-end pe-4">
          <button 
            onClick={toggleTheme}
            className="btn btn-link p-2 text-secondary hover-text-primary transition-all text-decoration-none shadow-none"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="position-relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn btn-link p-2 text-secondary hover-text-primary transition-all position-relative shadow-none"
            >
              <Bell size={18} />
              <div className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-2 border-dark rounded-circle" style={{ marginTop: '10px', marginLeft: '-12px' }} />
            </button>

            {showNotifications && (
              <div className="position-absolute end-0 mt-3 p-3 glass-card shadow-lg z-3" style={{ width: '320px' }}>
                <div className="d-flex align-items-center justify-content-between mb-3 px-1">
                  <h3 className="small fw-black text-uppercase tracking-widest m-0">Neural Alerts</h3>
                  <span className="small fw-bold text-primary">3 NEW</span>
                </div>
                <div className="d-grid gap-2">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 bg-light-subtle rounded-3 border-0 transition-all cursor-pointer group" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="small fw-black text-uppercase" style={{ fontSize: '10px' }}>{n.title}</span>
                        <span className="small text-muted" style={{ fontSize: '9px' }}>{n.time}</span>
                      </div>
                      <p className="small text-muted m-0 lh-sm">{n.msg}</p>
                    </div>
                  ))}
                </div>
                <button className="btn btn-link w-full mt-3 p-0 pt-3 small fw-black text-muted text-uppercase tracking-widest text-decoration-none border-top">
                  Clear All Transmissions
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 ps-2 cursor-pointer transition-all">
          <div className="text-end d-none d-sm-block">
            <p className="small fw-black text-inherit m-0 text-uppercase tracking-tight leading-none">{user?.name || 'Admin Operator'}</p>
            <p className="fw-bold text-primary text-uppercase tracking-widest m-0" style={{ fontSize: '10px', opacity: 0.8 }}>{user?.role || 'BUSINESS_OWNER'}</p>
          </div>
          <div className="rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <User size={20} className="text-primary" />
          </div>
          <ChevronDown size={14} className="text-muted" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
