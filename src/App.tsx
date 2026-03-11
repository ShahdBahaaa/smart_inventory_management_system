import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ChangePasswordPage from './pages/Auth/ChangePasswordPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import UsersPage from './pages/Users/UsersPage';
import ProductsPage from './pages/Products/ProductsPage';
import ProductDetailsPage from './pages/Products/ProductDetailsPage';
import SuppliersPage from './pages/Suppliers/SuppliersPage';
import SupplierScorecardPage from './pages/Suppliers/SupplierScorecardPage';
import ProfilePage from './pages/Profile/ProfilePage';
import PurchaseOrdersPage from './pages/PurchaseOrders/PurchaseOrdersPage';
import PODetailsPage from './pages/PurchaseOrders/PODetailsPage';
import ReportsLayout from './pages/Reports/ReportsLayout';
import ProductsReport from './pages/Reports/ProductsReport';
import SuppliersReport from './pages/Reports/SuppliersReport';
import StockReport from './pages/Reports/StockReport';
import ExpiryReport from './pages/Reports/ExpiryReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="suppliers/:id" element={<SupplierScorecardPage />} />
          <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="purchase-orders/:id" element={<PODetailsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="inventory" element={<ProductsPage />} />

          <Route path="reports" element={<ReportsLayout />}>
            <Route path="products" element={<ProductsReport />} />
            <Route path="suppliers" element={<SuppliersReport />} />
            <Route path="stock" element={<StockReport />} />
            <Route path="expiry" element={<ExpiryReport />} />
          </Route>

          {/* Fallback for dashboard routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
