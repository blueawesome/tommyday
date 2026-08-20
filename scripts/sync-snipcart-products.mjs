import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createSnipcartClient,
  getSnipcartProductId,
} from "./lib/snipcart-api.mjs";
import {
  groupProductsByUrl,
  readProductCatalog,
} from "./lib/product-catalog.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

export function parseSyncArguments(argv) {
  const supported = new Set(["--dry-run", "--force", "--verbose"]);
  for (const argument of argv) {
    if (!supported.has(argument)) throw new Error(`Unknown argument: ${argument}`);
  }
  return {
    dryRun: argv.includes("--dry-run"),
    force: argv.includes("--force"),
    verbose: argv.includes("--verbose"),
  };
}

export async function syncSnipcartProducts({
  rootDirectory = root,
  apiKey = process.env.SNIPCART_SECRET_API_KEY,
  siteUrl = process.env.SNIPCART_SITE_URL || "https://tommyday.com",
  args = parseSyncArguments(process.argv.slice(2)),
  client,
  logger = console,
  crawlDelayMs = 1_200,
} = {}) {
  const catalog = await readProductCatalog({ root: rootDirectory });
  const localProducts = catalog.products.map((product) => ({
    ...product,
    url: new URL(
      `${new URL(product.url, catalog.siteUrl).pathname}${new URL(product.url, catalog.siteUrl).search}`,
      siteUrl
    ).href,
  }));

  logger.log(
    `Found ${localProducts.length} purchasable Snipcart product(s) in the generated catalog.`
  );
  if (localProducts.length === 0) {
    throw new Error(
      "The generated Snipcart catalog contains no active products. " +
        "Confirm the storefront has purchasable products and PUBLIC_SNIPCART_API_KEY was set during the build."
    );
  }

  if (!apiKey && !client) {
    logger.log("No SNIPCART_SECRET_API_KEY supplied; catalog comparison was skipped.");
    for (const product of localProducts) {
      logger.log(
        `- ${product.id}\n  URL: ${product.url}\n  Initial inventory: ${product.initialInventory}`
      );
    }
    if (args.dryRun) logger.log("Dry run: no Snipcart data changed.");
    return { localProducts, compared: false, missing: [] };
  }

  const snipcart = client || createSnipcartClient({ apiKey, logger });
  const remoteProducts = await snipcart.listAllProducts();
  const existingIds = new Set(remoteProducts.map(getSnipcartProductId).filter(Boolean));
  const missing = localProducts.filter((product) => !existingIds.has(product.id));
  const productsToCrawl = args.force ? localProducts : missing;
  const groups = groupProductsByUrl(productsToCrawl);

  logger.log(`Found ${remoteProducts.length} existing product(s) in the selected Snipcart catalog.`);
  logger.log(`Missing ${missing.length} product(s) across ${groupProductsByUrl(missing).size} public page(s).`);

  for (const product of missing) {
    logger.log(
      `- ${product.id}\n  URL: ${product.url}\n  Initial inventory: ${product.initialInventory}`
    );
  }

  if (args.dryRun) {
    if (args.force) logger.log(`Force dry run: would re-crawl ${groups.size} public page(s).`);
    logger.log("Dry run: no Snipcart data changed.");
    return { localProducts, remoteProducts, missing, compared: true };
  }

  if (groups.size === 0) {
    logger.log("No product pages need to be crawled. No Snipcart data changed.");
    return { localProducts, remoteProducts, missing, compared: true, initialized: [] };
  }

  const newlyImported = new Map();
  let crawled = 0;

  for (const [url, expectedProducts] of groups) {
    if (crawled > 0) await snipcart.sleep(crawlDelayMs);
    if (args.verbose) logger.log(`Crawling ${url}`);

    const response = await snipcart.crawlUrl(url);
    if (!Array.isArray(response)) {
      throw new Error(`Snipcart crawl for ${url} did not return a JSON array.`);
    }

    const returnedIds = new Set(response.map(getSnipcartProductId).filter(Boolean));
    const absent = expectedProducts
      .map((product) => product.id)
      .filter((id) => !returnedIds.has(id));
    if (absent.length) {
      throw new Error(
        `Snipcart crawled ${url}, but did not return expected product(s): ${absent.join(", ")}.`
      );
    }

    for (const product of expectedProducts) {
      if (!existingIds.has(product.id)) newlyImported.set(product.id, product);
    }
    crawled += 1;
    logger.log(
      `${args.force ? "Re-crawled" : "Registered"} ${url}: ${[...returnedIds].join(", ") || "(no IDs)"}.`
    );
  }

  const initialized = [];
  for (const product of newlyImported.values()) {
    if (product.trackInventory === false) {
      logger.log(`Imported ${product.id} without inventory tracking.`);
      continue;
    }
    try {
      await snipcart.updateInventory(product.id, {
        inventoryManagementMethod: "Single",
        stock: product.initialInventory,
        allowOutOfStockPurchases: product.allowOutOfStockPurchases ?? false,
      });
      initialized.push(product.id);
      logger.log(`Initialized ${product.id} with stock ${product.initialInventory}.`);
    } catch (error) {
      throw new Error(
        `Product "${product.id}" was imported, but inventory initialization failed. ` +
          `This is a partial failure; inspect the selected Snipcart catalog before retrying. ${
            error instanceof Error ? error.message : ""
          }`
      );
    }
  }

  logger.log(
    `Product sync complete: crawled ${crawled} page(s), initialized ${initialized.length} genuinely new product(s), reset 0 existing inventories.`
  );

  return {
    localProducts,
    remoteProducts,
    missing,
    compared: true,
    initialized,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await syncSnipcartProducts();
}
