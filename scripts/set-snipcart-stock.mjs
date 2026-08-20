import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createSnipcartClient,
  getTrackedStock,
} from "./lib/snipcart-api.mjs";

export function parseStockArguments(argv) {
  const flags = new Set(argv.filter((argument) => argument.startsWith("--")));
  const positional = argv.filter((argument) => !argument.startsWith("--"));
  const supported = new Set(["--dry-run", "--confirm"]);

  for (const flag of flags) {
    if (!supported.has(flag)) throw new Error(`Unknown flag: ${flag}`);
  }
  if (positional.length !== 2) {
    throw new Error("Usage: npm run set:snipcart-stock -- <product-id> <count> [--dry-run|--confirm]");
  }
  if (flags.has("--dry-run") && flags.has("--confirm")) {
    throw new Error("Use either --dry-run or --confirm, not both.");
  }

  const [id, rawCount] = positional;
  const count = Number(rawCount);
  if (!Number.isInteger(count) || count < 0) {
    throw new Error("The new stock count must be a non-negative integer.");
  }

  return {
    id,
    count,
    dryRun: flags.has("--dry-run"),
    confirm: flags.has("--confirm"),
  };
}

export async function setSnipcartStock({
  args = parseStockArguments(process.argv.slice(2)),
  apiKey = process.env.SNIPCART_SECRET_API_KEY,
  client,
  logger = console,
} = {}) {
  const snipcart = client || createSnipcartClient({ apiKey, logger });
  const currentProduct = await snipcart.getProduct(args.id);
  const currentStock = getTrackedStock(currentProduct);

  logger.log(
    `Product ${args.id}: current stock ${currentStock === null ? "untracked/unknown" : currentStock}; requested absolute stock ${args.count}.`
  );

  if (args.dryRun) {
    logger.log("Dry run: no Snipcart data changed.");
    return { updated: false, currentStock };
  }
  if (!args.confirm) {
    throw new Error("Refusing to update stock without --confirm. Use --dry-run to preview.");
  }

  await snipcart.updateInventory(args.id, {
    inventoryManagementMethod: "Single",
    stock: args.count,
    allowOutOfStockPurchases: false,
  });
  logger.log(`Updated ${args.id} to absolute stock ${args.count}.`);
  return { updated: true, currentStock, stock: args.count };
}

const currentPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (currentPath === fileURLToPath(import.meta.url)) {
  await setSnipcartStock();
}
