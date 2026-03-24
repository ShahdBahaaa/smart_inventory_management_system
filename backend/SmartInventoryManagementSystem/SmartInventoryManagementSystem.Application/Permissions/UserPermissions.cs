using SmartInventoryManagementSystem.Domain.Enums;

namespace SmartInventoryManagementSystem.Application.Permissions
{
    public static class UserPermissions
    {
        // ===== USERS MODULE =====
        public static bool CanViewUsers(UserRole role) =>
            role == UserRole.ADMIN;

        public static bool CanCreateUser(UserRole role) =>
            role == UserRole.ADMIN;

        public static bool CanEditUser(UserRole role) =>
            role == UserRole.ADMIN;

        public static bool CanDeleteUser(UserRole role) =>
            role == UserRole.ADMIN;

        // ===== PRODUCTS MODULE =====
        public static bool CanViewProducts(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.BUSINESS_OWNER ||
            role == UserRole.INVENTORY_MANAGER ||
            role == UserRole.WAREHOUSE_STAFF;

        public static bool CanCreateProduct(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.INVENTORY_MANAGER;

        public static bool CanEditProduct(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.INVENTORY_MANAGER;

        public static bool CanDeleteProduct(UserRole role) =>
            role == UserRole.ADMIN;

        // ===== SUPPLIERS MODULE =====
        public static bool CanViewSuppliers(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.BUSINESS_OWNER ||
            role == UserRole.INVENTORY_MANAGER;

        public static bool CanCreateSupplier(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.INVENTORY_MANAGER;

        public static bool CanEditSupplier(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.INVENTORY_MANAGER;

        public static bool CanDeleteSupplier(UserRole role) =>
            role == UserRole.ADMIN;

        // ===== PURCHASE ORDERS MODULE =====
        public static bool CanViewPurchaseOrders(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.BUSINESS_OWNER ||
            role == UserRole.INVENTORY_MANAGER;

        public static bool CanCreatePurchaseOrder(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.INVENTORY_MANAGER;

        public static bool CanApprovePurchaseOrder(UserRole role) =>
            role == UserRole.BUSINESS_OWNER;

        // ===== STOCK MOVEMENTS MODULE =====
        public static bool CanViewStockMovements(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.BUSINESS_OWNER ||
            role == UserRole.INVENTORY_MANAGER ||
            role == UserRole.WAREHOUSE_STAFF;

        public static bool CanCreateStockMovement(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.INVENTORY_MANAGER ||
            role == UserRole.WAREHOUSE_STAFF;

        // ===== DISCOUNTS MODULE =====
        public static bool CanViewDiscounts(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.BUSINESS_OWNER ||
            role == UserRole.INVENTORY_MANAGER;

        public static bool CanApproveDiscount(UserRole role) =>
            role == UserRole.BUSINESS_OWNER;

        // ===== ALERTS MODULE =====
        public static bool CanViewAlerts(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.BUSINESS_OWNER ||
            role == UserRole.INVENTORY_MANAGER ||
            role == UserRole.WAREHOUSE_STAFF;

        // ===== ANALYTICS MODULE =====
        public static bool CanViewAnalytics(UserRole role) =>
            role == UserRole.ADMIN ||
            role == UserRole.BUSINESS_OWNER ||
            role == UserRole.INVENTORY_MANAGER;

        // ===== COMPANIES MODULE =====
        public static bool CanViewCompanies(UserRole role) =>
            role == UserRole.ADMIN;

        public static bool CanCreateCompany(UserRole role) =>
            role == UserRole.ADMIN;
    }
}