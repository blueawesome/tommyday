import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const availabilityPath = resolve(process.cwd(), "src/data/productAvailability.json");
const apiKey = process.env.SNIPCART_SECRET_API_KEY;

if (!apiKey) {
  throw new Error("Missing SNIPCART_SECRET_API_KEY.");
}

async function snipcartFetch(path) {
  const response = await fetch(`https://app.snipcart.com/api${path}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Snipcart API request failed (${response.status}): ${await response.text()}`);
  }

  return response.json();
}

function getProductId(product) {
  return product.userDefinedId || product.id || product.uniqueId || product.sku || null;
}

function getProductStock(product) {
  const stock = product.stock ?? product.inventory ?? product.quantity ?? product.availableStock;
  return typeof stock === "number" ? stock : null;
}

const overlay = JSON.parse(await readFile(availabilityPath, "utf8"));
overlay.products ||= {};

const productsResponse = await snipcartFetch("/products");
const products = productsResponse.items || productsResponse.data || productsResponse || [];

if (!Array.isArray(products)) {
  throw new Error("Unexpected Snipcart products response shape.");
}

const now = new Date().toISOString();
let changed = 0;

for (const product of products) {
  const id = getProductId(product);
  const stock = getProductStock(product);

  if (!id || stock === null) continue;

  const current = overlay.products[id] || {};
  const nextStatus = stock <= 0
    ? id.endsWith("-original")
      ? "sold"
      : "sold-out"
    : current.status === "sold" || current.status === "sold-out"
      ? "available"
      : current.status;

  if (current.inventory !== stock || current.status !== nextStatus) {
    overlay.products[id] = {
      ...current,
      inventory: stock,
      status: nextStatus,
      source: "snipcart-sync",
      updatedAt: now,
    };
    changed += 1;
  }
}

await writeFile(availabilityPath, `${JSON.stringify(overlay, null, 2)}\n`);
console.log(`Synced Snipcart stock. Updated ${changed} product override(s).`);
