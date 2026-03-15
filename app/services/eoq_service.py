import math

def calculate_inventory_metrics(annual_demand: float, order_cost: float, holding_cost: float, lead_time: int, safety_stock: int):
    # 1. Calculate EOQ
    if holding_cost <= 0:
        eoq = 0
    else:
        eoq = math.sqrt((2 * annual_demand * order_cost) / holding_cost)
    
    # 2. Calculate Reorder Point (ROP)
    daily_demand = annual_demand / 365
    rop = (daily_demand * lead_time) + safety_stock
    
    return round(eoq, 2), round(rop, 2)