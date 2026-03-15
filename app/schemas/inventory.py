from pydantic import BaseModel

class InventoryInput(BaseModel):
    product_id: int
    product_name: str
    annual_demand: float
    order_cost: float
    holding_cost: float
    lead_time_days: int    # New: How long delivery takes
    safety_stock: int       # New: Buffer stock

class EOQResponse(BaseModel):
    product_id: int
    recommended_order_quantity: float
    reorder_point: float    # New: The 'When' answer
    message: str