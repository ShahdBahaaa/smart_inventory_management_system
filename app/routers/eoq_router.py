from fastapi import APIRouter, HTTPException
from app.schemas.inventory import InventoryInput, EOQResponse
from app.services.eoq_service import calculate_inventory_metrics

# 1. First, we define the router (The 'Front Desk' itself)
router = APIRouter(prefix="/ml", tags=["Machine Learning"])

# 2. Then, we use the router to create the endpoint
@router.post("/calculate", response_model=EOQResponse)
def process_inventory_data(data: InventoryInput):
    if data.annual_demand < 0:
        raise HTTPException(status_code=400, detail="Demand cannot be negative")

    # This calls your 'Brain' to get both answers
    eoq, rop = calculate_inventory_metrics(
        data.annual_demand, 
        data.order_cost, 
        data.holding_cost, 
        data.lead_time_days, 
        data.safety_stock
    )

    return {
        "product_id": data.product_id,
        "recommended_order_quantity": eoq,
        "reorder_point": rop,
        "message": f"Optimization successful for {data.product_name}. Order {eoq} units when stock hits {rop}."
    }