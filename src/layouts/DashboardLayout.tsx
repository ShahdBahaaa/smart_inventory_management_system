import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '@/components/common/Sidebar';
import Navbar from '@/layouts/Navbar';
import { useAuth } from '@/hooks/useAuth';

const DashboardLayout = () => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="d-flex vh-100 vw-100 bg-inherit overflow-hidden">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column min-w-0" style={{ marginLeft: '260px' }}>
        <Navbar />
        <main className="flex-grow-1 overflow-auto p-4 p-lg-5">
          <div className="container-fluid" style={{ maxWidth: '1600px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
