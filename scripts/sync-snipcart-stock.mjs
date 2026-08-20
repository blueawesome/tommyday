import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createSnipcartClient,
  getSnipcartProductId,
  getTrackedStock,
} from "./lib/snipcart-api.mjs";
import { readProductCatalog } from "./lib/product-catalog.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const NON_SALE_STATUSES = new Set([
  "unavailable",
  "retired",
  "draft",
  "archive-only",
]);

export function nextInventoryStatus({ id, stock, currentStatus }) {
  if (NON_SALE_STATUSES.has(currentStatus)) return currentStatus;
  if (stock <= 0) return id.endsWith("-original") ? "sold" : "sold-out";
  if (id.endsWith("-original") && currentStatus === "sold") return "sold";
  return "available";
}

export async function syncSnipcartStock({
  rootDirectory = root,
  apiKey = process.env.SNIPCART_SECRET_API_KEY,
  dryRun = process.argv.includes("--dry-run"),
  client,
  logger = console,
  now = new Date().toISOString(),
} = {}) {
  const availabilityPath = resolve(
    rootDirectory,
    "src/data/productAvailability.json"
  );
  const catalog = await readProductCatalog({ root: rootDirectory });
  const manifestById = new Map(
    catalog.products.map((product) => [product.id, product])
  );
  const originalText = await readFile(availabilityPath, "utf8");
  const overlay = JSON.parse(originalText);
  overlay.products ||= {};

  const recognizedIds = new Set([
    ...manifestById.keys(),
    ...Object.keys(overlay.products),
  ]);
  const snipcart = client || createSnipcartClient({ apiKey, logger });
  const products = await snipcart.listAllProducts();
  const summary = {
    updated: [],
    unchanged: [],
    ignored: [],
    anomalous: [],
  };

  for (const product of products) {
    const id = getSnipcartProductId(product);
    if (!id) {
      summary.anomalous.push("(missing userDefinedId)");
      continue;
    }
    if (!recognizedIds.has(id)) {
      summary.ignored.push(id);
      continue;
    }

    const stock = getTrackedStock(product);
    if (stock === null) {
      summary.anomalous.push(`${id} (inventory disabled or stock unavailable)`);
      continue;
    }

    const current = overlay.products[id] || {};
    const nextStatus = nextInventoryStatus({
      id,
      stock,
      currentStatus: current.status,
    });
    if (NON_SALE_STATUSES.has(current.status)) {
      summary.ignored.push(`${id} (${current.status})`);
      continue;
    }

    if (current.inventory === stock && current.status === nextStatus) {
      summary.unchanged.push(id);
      continue;
    }

    overlay.products[id] = {
      ...current,
      inventory: stock,
      status: nextStatus,
      source: "snipcart-sync",
      updatedAt: now,
    };
    summary.updated.push(id);
  }

  const nextText = `${JSON.stringify(overlay, null, 2)}\n`;
  if (!dryRun && nextText !== originalText) {
    await writeFile(availabilityPath, nextText);
  }

  logger.log(
    `${dryRun ? "Dry run: " : ""}Snipcart stock reconciliation: ` +
      `${summary.updated.length} updated, ${summary.unchanged.length} unchanged, ` +
      `${summary.ignored.length} ignored, ${summary.anomalous.length} anomalous.`
  );
  for (const id of summary.updated) logger.log(`- updated: ${id}`);
  for (const id of summary.ignored) logger.log(`- ignored: ${id}`);
  for (const id of summary.anomalous) logger.log(`- anomalous: ${id}`);
  if (dryRun) logger.log("Dry run: productAvailability.json was not written.");

  return summary;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await syncSnipcartStock();
}
