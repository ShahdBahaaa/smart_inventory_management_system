import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ChangePasswordPage from '@/pages/auth/ChangePasswordPage';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import UsersPage from '@/pages/Users/UsersPage';
import ProductsPage from '@/pages/Products/ProductsPage';
import ProductDetailsPage from '@/pages/Products/ProductDetailsPage';
import SuppliersPage from '@/pages/Suppliers/SuppliersPage';
import SupplierScorecardPage from '@/pages/Suppliers/SupplierScorecardPage';
import ProfilePage from '@/pages/Profile/ProfilePage';
import PurchaseOrdersPage from '@/pages/PurchaseOrders/PurchaseOrdersPage';
import PODetailsPage from '@/pages/PurchaseOrders/PODetailsPage';
import POFormPage from '@/pages/PurchaseOrders/POFormPage';
import ReportsLayout from '@/pages/Reports/ReportsLayout';
import ProductsReport from '@/pages/Reports/ProductsReport';
import SuppliersReport from '@/pages/Reports/SuppliersReport';
import StockReport from '@/pages/Reports/StockReport';
import ExpiryReport from '@/pages/Reports/ExpiryReport';
import ReceivingPage from '@/pages/Warehouse/ReceivingPage';
import StockAdjustmentPage from '@/pages/Warehouse/StockAdjustmentPage';
import AIOptimizerHub from '@/pages/AIOptimizerHub';
import FefoAlertsPage from '@/pages/FefoAlertsPage';
import BusinessRulesPage from '@/pages/Owner/BusinessRulesPage';
import POApprovalPage from '@/pages/Owner/POApprovalPage';
import AuditLogPage from '@/pages/Owner/AuditLogPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="suppliers/:id" element={<SupplierScorecardPage />} />
        <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="purchase-orders/new" element={<POFormPage />} />
        <Route path="purchase-orders/:id" element={<PODetailsPage />} />
        <Route path="ai-optimizer" element={<AIOptimizerHub />} />
        <Route path="fefo" element={<FefoAlertsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="inventory" element={<ProductsPage />} />
        <Route path="receiving" element={<ReceivingPage />} />
        <Route path="stock-adjustment" element={<StockAdjustmentPage />} />
        <Route path="business-rules" element={<BusinessRulesPage />} />
        <Route path="po-approval" element={<POApprovalPage />} />
        <Route path="audit-log" element={<AuditLogPage />} />

        <Route path="reports" element={<ReportsLayout />}>
          <Route path="products" element={<ProductsReport />} />
          <Route path="suppliers" element={<SuppliersReport />} />
          <Route path="stock" element={<StockReport />} />
          <Route path="expiry" element={<ExpiryReport />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
