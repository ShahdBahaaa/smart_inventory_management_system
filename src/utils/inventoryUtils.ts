/**
 * Core Utility Functions for Testing
 * These are pure functions that can be unit tested independently.
 */

/**
 * Calculate Economic Order Quantity (EOQ)
 * @param annualDemand - Annual demand in units
 * @param orderingCost - Fixed cost per order ($/order)
 * @param holdingCost - Annual holding cost per unit ($/unit/year)
 */
export function calculateEOQ(annualDemand: number, orderingCost: number, holdingCost: number): number {
  if (holdingCost <= 0) throw new Error('Holding cost must be greater than 0');
  if (annualDemand < 0) throw new Error('Annual demand cannot be negative');
  return Math.round(Math.sqrt((2 * annualDemand * orderingCost) / holdingCost));
}

/**
 * Calculate Reorder Point (ROP)
 * @param avgDailyDemand - Average daily demand in units
 * @param leadTimeDays - Supplier lead time in days
 * @param safetyStock - Safety stock buffer units
 */
export function calculateReorderPoint(avgDailyDemand: number, leadTimeDays: number, safetyStock: number): number {
  return Math.ceil(avgDailyDemand * leadTimeDays) + safetyStock;
}

/**
 * Calculate days until expiry
 * @param expiryDate - ISO date string
 */
export function daysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate).getTime();
  const now = Date.now();
  return Math.ceil((expiry - now) / 86400000);
}

/**
 * Determine inventory status based on stock level and thresholds
 */
export function getStockStatus(stock: number, threshold: number): 'OUT_OF_STOCK' | 'LOW_STOCK' | 'OPTIMAL' {
  if (stock === 0) return 'OUT_OF_STOCK';
  if (stock < threshold) return 'LOW_STOCK';
  return 'OPTIMAL';
}

/**
 * Select batches following FEFO (First Expired, First Out) rule.
 * Returns batches sorted by expiry date ascending.
 */
export function sortBatchesByFEFO(batches: Array<{ lotNumber: string; expiryDate: string; quantity: number }>) {
  return [...batches].sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
}

/**
 * Format currency value
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}
