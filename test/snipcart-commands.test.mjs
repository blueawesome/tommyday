import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { applySnipcartOrder } from "../scripts/apply-snipcart-order.mjs";
import { setSnipcartStock } from "../scripts/set-snipcart-stock.mjs";
import { syncSnipcartProducts } from "../scripts/sync-snipcart-products.mjs";
import {
  nextInventoryStatus,
  syncSnipcartStock,
} from "../scripts/sync-snipcart-stock.mjs";

const silentLogger = { log() {}, warn() {}, error() {} };

async function makeProject(products) {
  const root = await mkdtemp(resolve(tmpdir(), "snipcart-test-"));
  await mkdir(resolve(root, "dist"), { recursive: true });
  await mkdir(resolve(root, "src/data"), { recursive: true });
  await writeFile(
    resolve(root, "dist/snipcart-product-catalog.json"),
    `${JSON.stringify({
      version: 1,
      siteUrl: "https://tommyday.com",
      products,
    })}\n`
  );
  await writeFile(
    resolve(root, "src/data/productAvailability.json"),
    '{\n  "version": 1,\n  "products": {}\n}\n'
  );
  return root;
}

const products = [
  {
    id: "one-original",
    url: "https://tommyday.com/collage/shared/",
    price: 100,
    initialInventory: 1,
    trackInventory: true,
    allowOutOfStockPurchases: false,
  },
  {
    id: "two-print",
    url: "https://tommyday.com/collage/shared/",
    price: 25,
    initialInventory: 4,
    trackInventory: true,
    allowOutOfStockPurchases: false,
  },
];

test("product sync groups URLs, imports sequentially, and initializes only missing IDs", async () => {
  const rootDirectory = await makeProject(products);
  const calls = [];
  const client = {
    async listAllProducts() {
      return [{ userDefinedId: "one-original" }];
    },
    async crawlUrl(url) {
      calls.push(["crawl", url]);
      return [
        { userDefinedId: "one-original" },
        { userDefinedId: "two-print" },
      ];
    },
    async updateInventory(id, body) {
      calls.push(["inventory", id, body.stock]);
    },
    async sleep() {
      calls.push(["sleep"]);
    },
  };

  const result = await syncSnipcartProducts({
    rootDirectory,
    client,
    logger: silentLogger,
    crawlDelayMs: 0,
    args: { dryRun: false, force: false, verbose: false },
  });

  assert.deepEqual(result.initialized, ["two-print"]);
  assert.deepEqual(calls, [
    ["crawl", "https://tommyday.com/collage/shared/"],
    ["inventory", "two-print", 4],
  ]);
});

test("--force recrawls but never resets an existing product stock", async () => {
  const rootDirectory = await makeProject(products);
  const updates = [];
  const client = {
    async listAllProducts() {
      return products.map(({ id }) => ({ userDefinedId: id }));
    },
    async crawlUrl() {
      return products.map(({ id }) => ({ userDefinedId: id }));
    },
    async updateInventory(id) {
      updates.push(id);
    },
    async sleep() {},
  };

  const result = await syncSnipcartProducts({
    rootDirectory,
    client,
    logger: silentLogger,
    args: { dryRun: false, force: true, verbose: false },
  });

  assert.deepEqual(result.initialized, []);
  assert.deepEqual(updates, []);
});

test("missing crawl IDs abort before inventory initialization", async () => {
  const rootDirectory = await makeProject(products);
  let updated = false;
  const client = {
    async listAllProducts() {
      return [];
    },
    async crawlUrl() {
      return [{ userDefinedId: "one-original" }];
    },
    async updateInventory() {
      updated = true;
    },
    async sleep() {},
  };

  await assert.rejects(
    syncSnipcartProducts({
      rootDirectory,
      client,
      logger: silentLogger,
      args: { dryRun: false, force: false, verbose: false },
    }),
    /did not return expected product.*two-print/
  );
  assert.equal(updated, false);
});

test("inventory initialization reports partial failure without touching existing products", async () => {
  const rootDirectory = await makeProject(products);
  const updates = [];
  const client = {
    async listAllProducts() {
      return [{ userDefinedId: "one-original" }];
    },
    async crawlUrl() {
      return products.map(({ id }) => ({ userDefinedId: id }));
    },
    async updateInventory(id) {
      updates.push(id);
      throw new Error("mock initialization failure");
    },
    async sleep() {},
  };

  await assert.rejects(
    syncSnipcartProducts({
      rootDirectory,
      client,
      logger: silentLogger,
      args: { dryRun: false, force: false, verbose: false },
    }),
    /partial failure/
  );
  assert.deepEqual(updates, ["two-print"]);
});

test("safe restock reads first, supports dry-run, and requires confirmation", async () => {
  const updates = [];
  const client = {
    async getProduct() {
      return { stock: 2, inventoryManagementMethod: "Single" };
    },
    async updateInventory(id, body) {
      updates.push([id, body.stock]);
    },
  };

  const dryRun = await setSnipcartStock({
    client,
    logger: silentLogger,
    args: { id: "two-print", count: 5, dryRun: true, confirm: false },
  });
  assert.equal(dryRun.updated, false);
  assert.deepEqual(updates, []);

  await assert.rejects(
    setSnipcartStock({
      client,
      logger: silentLogger,
      args: { id: "two-print", count: 5, dryRun: false, confirm: false },
    }),
    /--confirm/
  );

  await setSnipcartStock({
    client,
    logger: silentLogger,
    args: { id: "two-print", count: 5, dryRun: false, confirm: true },
  });
  assert.deepEqual(updates, [["two-print", 5]]);
});

test("stock status mapping protects deliberate non-sale and sold original states", () => {
  assert.equal(
    nextInventoryStatus({ id: "one-original", stock: 0, currentStatus: "available" }),
    "sold"
  );
  assert.equal(
    nextInventoryStatus({ id: "two-print", stock: 0, currentStatus: "available" }),
    "sold-out"
  );
  assert.equal(
    nextInventoryStatus({ id: "two-print", stock: 5, currentStatus: "unavailable" }),
    "unavailable"
  );
  assert.equal(
    nextInventoryStatus({ id: "one-original", stock: 1, currentStatus: "sold" }),
    "sold"
  );
});

test("stock reconciliation ignores historical products and avoids unchanged writes", async () => {
  const rootDirectory = await makeProject([products[0]]);
  await writeFile(
    resolve(rootDirectory, "src/data/productAvailability.json"),
    `${JSON.stringify({
      version: 1,
      products: {
        "one-original": {
          status: "sold",
          inventory: 0,
          source: "snipcart-sync",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      },
    }, null, 2)}\n`
  );
  const before = await readFile(
    resolve(rootDirectory, "src/data/productAvailability.json"),
    "utf8"
  );
  const summary = await syncSnipcartStock({
    rootDirectory,
    client: {
      async listAllProducts() {
        return [
          { userDefinedId: "one-original", stock: 0 },
          { userDefinedId: "preorder-history", stock: 10 },
        ];
      },
    },
    logger: silentLogger,
    now: "2026-02-01T00:00:00.000Z",
  });
  const after = await readFile(
    resolve(rootDirectory, "src/data/productAvailability.json"),
    "utf8"
  );

  assert.deepEqual(summary.unchanged, ["one-original"]);
  assert.deepEqual(summary.ignored, ["preorder-history"]);
  assert.equal(after, before);
});

test("order application uses the generated manifest, synchronized stock, and order idempotency", async () => {
  const rootDirectory = await makeProject(products);
  const payload = {
    content: {
      id: "order-123",
      items: [
        { id: "two-print", quantity: 2 },
        { id: "preorder-history", quantity: 1 },
      ],
    },
    _tommyDay: {
      snipcartStock: {
        "two-print": { inventory: 2 },
      },
    },
  };

  const result = await applySnipcartOrder({
    rootDirectory,
    payload,
    logger: silentLogger,
    now: "2026-02-01T00:00:00.000Z",
  });
  const overlay = JSON.parse(
    await readFile(
      resolve(rootDirectory, "src/data/productAvailability.json"),
      "utf8"
    )
  );

  assert.equal(result.duplicate, false);
  assert.deepEqual(result.ignored, ["preorder-history"]);
  assert.equal(overlay.products["two-print"].inventory, 2);
  assert.equal(overlay.products["two-print"].status, "available");
  assert.deepEqual(
    overlay.processedOrders["order-123"].updatedProductIds,
    ["two-print"]
  );

  const duplicate = await applySnipcartOrder({
    rootDirectory,
    payload,
    logger: silentLogger,
    now: "2026-02-02T00:00:00.000Z",
  });
  assert.equal(duplicate.duplicate, true);
});
