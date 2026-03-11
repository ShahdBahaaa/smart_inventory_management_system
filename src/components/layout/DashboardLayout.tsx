import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  // Mock auth check
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container-fluid p-0">
      <Navbar />
      <div className="row g-0">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
