export type InventoryStatus =
  | "available"
  | "sold"
  | "sold-out"
  | "unavailable"
  | "retired"
  | "draft"
  | "archive-only";

export type InventoryProduct = {
  id: string;
  status: InventoryStatus;
  price?: number;
  initialInventory?: number;
  inventory?: number;
  trackInventory?: boolean;
  allowOutOfStockPurchases?: boolean;
  externalUrl?: string;
};

export function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

export function shouldRenderSnipcartPurchaseControl(product: InventoryProduct) {
  return (
    product.status === "available" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    !product.externalUrl
  );
}

export function tracksInventory(product: InventoryProduct) {
  return product.trackInventory !== false;
}

export function getAllowOutOfStockPurchases(product: InventoryProduct) {
  return product.allowOutOfStockPurchases ?? false;
}

export function getEffectiveInventory(product: InventoryProduct) {
  if (isNonNegativeInteger(product.inventory)) return product.inventory;
  if (isNonNegativeInteger(product.initialInventory)) return product.initialInventory;
  return undefined;
}

export function validatePurchasableInventory(product: InventoryProduct) {
  if (!shouldRenderSnipcartPurchaseControl(product) || !tracksInventory(product)) return;

  if (!isNonNegativeInteger(product.initialInventory)) {
    throw new Error(
      `Product "${product.id}" is available and inventory-tracked, but initialInventory is missing or invalid. ` +
        "Set a non-negative integer, mark the product unavailable, or explicitly set trackInventory: false."
    );
  }
}
