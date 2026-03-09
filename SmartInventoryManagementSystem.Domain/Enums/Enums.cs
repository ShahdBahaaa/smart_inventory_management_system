namespace SmartInventoryManagementSystem.Domain.Enums
{
    public enum UserRole
    {
        ADMIN,
        BUSINESS_OWNER,
        INVENTORY_MANAGER,
        WAREHOUSE_STAFF
    }

    public enum UserStatus { ACTIVE, INACTIVE }

    public enum ProductUnit { PIECE, KG, LITER, BOX }

    public enum ProductStatus { ACTIVE, INACTIVE, DISCONTINUED }

    public enum ABCCategory { A, B, C }

    public enum BatchStatus { ACTIVE, NEAR_EXPIRY, EXPIRED, USED }

    public enum MovementType { IN, OUT, ADJUSTMENT }

    public enum SupplierClassification { RELIABLE, ACCEPTABLE, WARNING, PROBATION }

    public enum POStatus { DRAFT, SENT, CONFIRMED, RECEIVED, CLOSED }

    public enum POItemStatus { PENDING, PARTIALLY_RECEIVED, COMPLETED }
}