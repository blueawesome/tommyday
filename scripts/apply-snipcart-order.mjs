import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const availabilityPath = resolve(root, "src/data/productAvailability.json");
const artworksPath = resolve(root, "src/data/artworks.ts");
const preorderProductsPath = resolve(root, "src/data/preorderProducts.ts");

function readArg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1] || null;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function stableHash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);
}

async function getKnownProductIds() {
  const source = [
    await readFile(artworksPath, "utf8"),
    await readFile(preorderProductsPath, "utf8"),
  ].join("\n");
  const slugs = [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
  const explicitIds = [...source.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);

  return new Set([
    ...slugs.map((slug) => `${slug}-original`),
    ...explicitIds,
  ]);
}

async function readPayload() {
  const payloadPath = readArg("--payload");
  if (payloadPath) {
    return JSON.parse(await readFile(resolve(process.cwd(), payloadPath), "utf8"));
  }

  if (process.env.SNIPCART_ORDER_PAYLOAD) {
    return JSON.parse(process.env.SNIPCART_ORDER_PAYLOAD);
  }

  throw new Error("Missing order payload. Pass --payload <file> or SNIPCART_ORDER_PAYLOAD.");
}

function getOrder(payload) {
  return payload?.content || payload?.order || payload?.invoice || payload;
}

function getOrderId(payload, order) {
  return (
    order?.token ||
    order?.id ||
    order?.invoiceNumber ||
    order?.reference ||
    payload?.eventId ||
    payload?.token ||
    stableHash(payload)
  );
}

function getLineItems(order) {
  const candidates = [
    order?.items,
    order?.products,
    order?.cart?.items,
    order?.details?.items,
  ];

  return candidates.find((candidate) => Array.isArray(candidate)) || [];
}

function getLineItemId(item) {
  return (
    item?.id ||
    item?.uniqueId ||
    item?.productId ||
    item?.userDefinedId ||
    item?.sku ||
    item?.metadata?.id ||
    item?.customFields?.id ||
    null
  );
}

function getLineItemQuantity(item) {
  const quantity = Number(item?.quantity ?? item?.qty ?? 1);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function getSnipcartStockForProduct(payload, itemId) {
  const stockEntry = payload?._tommyDay?.snipcartStock?.[itemId];
  const inventory = Number(
    typeof stockEntry === "number" ? stockEntry : stockEntry?.inventory
  );

  return Number.isFinite(inventory) ? inventory : null;
}

function applyItemToOverlay({ overlay, itemId, quantity, orderId, now, snipcartInventory }) {
  const current = overlay.products[itemId] || {};

  if (itemId.endsWith("-original")) {
    overlay.products[itemId] = {
      ...current,
      status: "sold",
      inventory: 0,
      source: "snipcart-webhook",
      orderId,
      updatedAt: now,
    };
    return "marked original sold";
  }

  if (snipcartInventory !== null) {
    const inventory = Math.max(snipcartInventory, 0);
    overlay.products[itemId] = {
      ...current,
      inventory,
      status: inventory === 0 ? "sold-out" : "available",
      source: "snipcart-webhook-stock",
      orderId,
      updatedAt: now,
    };
    return inventory === 0
      ? "marked product sold-out from Snipcart stock"
      : `synced Snipcart inventory to ${inventory}`;
  }

  if (typeof current.inventory === "number") {
    const inventory = Math.max(current.inventory - quantity, 0);
    overlay.products[itemId] = {
      ...current,
      inventory,
      status: inventory === 0 ? "sold-out" : current.status || "available",
      source: "snipcart-webhook",
      orderId,
      updatedAt: now,
    };
    return inventory === 0 ? "marked product sold-out" : `decremented inventory to ${inventory}`;
  }

  return "no tracked inventory; left unchanged";
}

const payload = await readPayload();
const dryRun = hasFlag("--dry-run");
const order = getOrder(payload);
const orderId = getOrderId(payload, order);
const knownProductIds = await getKnownProductIds();
const overlay = JSON.parse(await readFile(availabilityPath, "utf8"));

overlay.processedOrders ||= {};
overlay.products ||= {};

if (overlay.processedOrders[orderId]) {
  console.log(`Order ${orderId} already processed; no changes made.`);
  process.exit(0);
}

const items = getLineItems(order);
const now = new Date().toISOString();
const updates = [];
const ignored = [];

for (const item of items) {
  const itemId = getLineItemId(item);
  if (!itemId || !knownProductIds.has(itemId)) {
    ignored.push(itemId || "(missing product id)");
    continue;
  }

  const quantity = getLineItemQuantity(item);
  const snipcartInventory = getSnipcartStockForProduct(payload, itemId);
  const result = applyItemToOverlay({
    overlay,
    itemId,
    quantity,
    orderId,
    now,
    snipcartInventory,
  });
  updates.push({ itemId, quantity, result });
}

overlay.processedOrders[orderId] = {
  processedAt: now,
  itemCount: items.length,
  updatedProductIds: updates.map((update) => update.itemId),
  ignoredProductIds: ignored,
};

if (!dryRun) {
  await writeFile(availabilityPath, `${JSON.stringify(overlay, null, 2)}\n`);
}

console.log(`${dryRun ? "Dry run processed" : "Processed"} order ${orderId}.`);
for (const update of updates) {
  console.log(`- ${update.itemId} x${update.quantity}: ${update.result}`);
}
for (const itemId of ignored) {
  console.log(`- ignored unknown product: ${itemId}`);
}
