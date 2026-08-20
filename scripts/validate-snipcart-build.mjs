import { readFile, readdir } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function attributesFor(node) {
  return Object.fromEntries((node.attrs || []).map(({ name, value }) => [name, value]));
}

function visit(node, callback) {
  callback(node);
  for (const child of node.childNodes || []) visit(child, callback);
  if (node.content) visit(node.content, callback);
}

function normalizeUrl(value, siteUrl) {
  return new URL(value, siteUrl).href;
}

function normalizeNumber(value) {
  if (value === undefined || value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
}

function normalizeCategories(value) {
  if (!value) return undefined;
  return value
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .sort();
}

function normalizeAlternatePrices(attributes) {
  const entries = Object.entries(attributes)
    .filter(([name]) => name.startsWith("data-item-price-") && name !== "data-item-price")
    .map(([name, value]) => [
      name.replace("data-item-price-", ""),
      normalizeNumber(value),
    ]);

  return entries.length ? Object.fromEntries(entries.sort(([left], [right]) => left.localeCompare(right))) : undefined;
}

export function collectSnipcartMarkup(html, { source = "(generated HTML)", siteUrl }) {
  const definitions = [];
  const document = parse(html);

  visit(document, (node) => {
    const attributes = attributesFor(node);
    const classes = (attributes.class || "").split(/\s+/).filter(Boolean);
    if (!classes.includes("snipcart-add-item")) return;

    definitions.push({
      id: attributes["data-item-id"],
      url: attributes["data-item-url"]
        ? normalizeUrl(attributes["data-item-url"], siteUrl)
        : undefined,
      price: normalizeNumber(attributes["data-item-price"]),
      categories: normalizeCategories(attributes["data-item-categories"]),
      alternatePrices: normalizeAlternatePrices(attributes),
      initialInventory: normalizeNumber(attributes["data-initial-inventory"]),
      allowOutOfStockPurchases:
        attributes["data-allow-out-of-stock-purchases"] === undefined
          ? undefined
          : attributes["data-allow-out-of-stock-purchases"] === "true",
      source,
    });
  });

  return definitions;
}

async function listHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listHtmlFiles(path)));
    if (entry.isFile() && extname(entry.name) === ".html") files.push(path);
  }

  return files.sort();
}

function definitionConflict(left, right) {
  return (
    left.url !== right.url ||
    left.price !== right.price ||
    JSON.stringify(left.categories) !== JSON.stringify(right.categories) ||
    JSON.stringify(left.alternatePrices) !== JSON.stringify(right.alternatePrices) ||
    left.initialInventory !== right.initialInventory ||
    left.allowOutOfStockPurchases !== right.allowOutOfStockPurchases
  );
}

function normalizeExpectedCategories(categories) {
  return Array.isArray(categories) && categories.length
    ? [...categories].sort()
    : undefined;
}

function normalizeExpectedAlternatePrices(alternatePrices) {
  if (!alternatePrices || typeof alternatePrices !== "object") return undefined;

  return Object.fromEntries(
    Object.entries(alternatePrices).sort(([left], [right]) => left.localeCompare(right))
  );
}

export function validateCatalogAgainstMarkup(catalog, definitions) {
  if (!catalog || catalog.version !== 1 || !Array.isArray(catalog.products)) {
    throw new Error("Invalid dist/snipcart-product-catalog.json shape.");
  }

  const errors = [];
  const catalogById = new Map();
  const markupById = new Map();

  for (const product of catalog.products) {
    if (!product?.id) {
      errors.push("Manifest contains a product without an ID.");
      continue;
    }
    if (catalogById.has(product.id)) {
      errors.push(`Manifest contains duplicate product ID "${product.id}".`);
      continue;
    }
    catalogById.set(product.id, product);
  }

  for (const definition of definitions) {
    if (!definition.id) {
      errors.push(`Snipcart markup in ${definition.source} is missing data-item-id.`);
      continue;
    }

    const previous = markupById.get(definition.id);
    if (previous && definitionConflict(previous, definition)) {
      errors.push(
        `Conflicting markup for "${definition.id}" in ${previous.source} and ${definition.source}.`
      );
    } else if (!previous) {
      markupById.set(definition.id, definition);
    }
  }

  for (const [id, product] of catalogById) {
    const definition = markupById.get(id);
    if (!definition) {
      errors.push(
        `Manifest product "${id}" has no rendered .snipcart-add-item markup. ` +
          "Confirm PUBLIC_SNIPCART_API_KEY was available during the Astro build."
      );
      continue;
    }

    const expected = {
      url: normalizeUrl(product.url, catalog.siteUrl),
      price: product.price,
      categories: normalizeExpectedCategories(product.categories),
      alternatePrices: normalizeExpectedAlternatePrices(product.alternatePrices),
      initialInventory: product.initialInventory,
      allowOutOfStockPurchases: product.allowOutOfStockPurchases,
    };

    if (definition.url !== expected.url) {
      errors.push(`URL mismatch for "${id}": manifest=${expected.url}, markup=${definition.url}.`);
    }
    if (definition.price !== expected.price) {
      errors.push(
        `Price mismatch for "${id}": manifest=${expected.price}, markup=${definition.price}.`
      );
    }
    if (JSON.stringify(definition.categories) !== JSON.stringify(expected.categories)) {
      errors.push(
        `Category mismatch for "${id}": manifest=${JSON.stringify(expected.categories)}, markup=${JSON.stringify(definition.categories)}.`
      );
    }
    if (
      JSON.stringify(definition.alternatePrices) !==
      JSON.stringify(expected.alternatePrices)
    ) {
      errors.push(
        `Alternate price mismatch for "${id}": manifest=${JSON.stringify(expected.alternatePrices)}, markup=${JSON.stringify(definition.alternatePrices)}.`
      );
    }
    if (definition.initialInventory !== expected.initialInventory) {
      errors.push(
        `Initial inventory mismatch for "${id}": manifest=${expected.initialInventory}, markup=${definition.initialInventory}.`
      );
    }
    if (
      definition.allowOutOfStockPurchases !== expected.allowOutOfStockPurchases
    ) {
      errors.push(
        `Out-of-stock policy mismatch for "${id}": manifest=${expected.allowOutOfStockPurchases}, markup=${definition.allowOutOfStockPurchases}.`
      );
    }
  }

  for (const [id, definition] of markupById) {
    if (!catalogById.has(id)) {
      errors.push(
        `Rendered Snipcart product "${id}" in ${definition.source} is absent from the generated manifest.`
      );
    }
  }

  if (errors.length) {
    throw new Error(`Snipcart build validation failed:\n- ${errors.join("\n- ")}`);
  }

  return {
    products: catalogById.size,
    markupDefinitions: definitions.length,
  };
}

export async function validateGeneratedSnipcartBuild({
  distDirectory = resolve(root, "dist"),
} = {}) {
  const manifestPath = resolve(distDirectory, "snipcart-product-catalog.json");
  const catalog = JSON.parse(await readFile(manifestPath, "utf8"));
  const definitions = [];

  for (const htmlPath of await listHtmlFiles(distDirectory)) {
    definitions.push(
      ...collectSnipcartMarkup(await readFile(htmlPath, "utf8"), {
        source: htmlPath,
        siteUrl: catalog.siteUrl,
      })
    );
  }

  return validateCatalogAgainstMarkup(catalog, definitions);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await validateGeneratedSnipcartBuild();
  console.log(
    `Validated ${result.products} Snipcart product(s) across ${result.markupDefinitions} rendered definition(s).`
  );
}
