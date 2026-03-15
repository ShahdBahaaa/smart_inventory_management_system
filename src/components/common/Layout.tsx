import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/common/Sidebar';
import { Container } from 'react-bootstrap';

export default function Layout() {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 overflow-auto p-4">
        <Container fluid="xl">
          <Outlet />
        </Container>
      </div>
    </div>
  );
}
