import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export function validateManifestProduct(product) {
  if (!product || typeof product.id !== "string" || !product.id) {
    throw new Error("Snipcart manifest contains a product without a valid ID.");
  }
  if (typeof product.url !== "string" || !product.url) {
    throw new Error(`Manifest product "${product.id}" has no public URL.`);
  }
  if (typeof product.price !== "number" || !Number.isFinite(product.price)) {
    throw new Error(`Manifest product "${product.id}" has an invalid price.`);
  }
  if (product.trackInventory !== false) {
    if (
      typeof product.initialInventory !== "number" ||
      !Number.isInteger(product.initialInventory) ||
      product.initialInventory < 0
    ) {
      throw new Error(
        `Manifest product "${product.id}" is inventory-tracked but has invalid initialInventory.`
      );
    }
  }
}

export async function readProductCatalog({
  root = process.cwd(),
  path = resolve(root, "dist/snipcart-product-catalog.json"),
} = {}) {
  let catalog;

  try {
    catalog = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(
      `Could not read ${path}. Run npm run build first. ${error instanceof Error ? error.message : ""}`
    );
  }

  if (catalog?.version !== 1 || !Array.isArray(catalog.products)) {
    throw new Error(`Unexpected Snipcart product manifest shape in ${path}.`);
  }

  const ids = new Set();
  for (const product of catalog.products) {
    validateManifestProduct(product);
    if (ids.has(product.id)) {
      throw new Error(`Duplicate product ID "${product.id}" in Snipcart manifest.`);
    }
    ids.add(product.id);
  }

  return catalog;
}

export function groupProductsByUrl(products) {
  const groups = new Map();

  for (const product of products) {
    const url = new URL(product.url).href;
    const group = groups.get(url) || [];
    group.push(product);
    groups.set(url, group);
  }

  return groups;
}
