export function getTrackedSnipcartStock(product) {
  const method = String(product?.inventoryManagementMethod || "").toLowerCase();
  if (method === "disabled" || method === "donttrack") return null;

  const rawStock = product?.stock ?? product?.totalStock;
  if (rawStock === null || rawStock === undefined || rawStock === "") return null;
  const stock = Number(rawStock);
  return Number.isFinite(stock) ? stock : null;
}
