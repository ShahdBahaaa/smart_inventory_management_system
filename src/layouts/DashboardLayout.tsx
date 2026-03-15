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
    <div className="d-flex w-100 vh-100 overflow-hidden">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column h-100" style={{ minWidth: 0 }}>
        <Navbar />
        <main className="flex-grow-1 overflow-auto px-md-4 py-4 w-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
