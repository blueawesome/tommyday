import assert from "node:assert/strict";
import test from "node:test";
import {
  createSnipcartClient,
  getTrackedStock,
  parseRetryAfter,
} from "../scripts/lib/snipcart-api.mjs";

test("product pagination consumes every limit/offset page", async () => {
  const urls = [];
  const pages = [
    { items: [{ userDefinedId: "one" }, { userDefinedId: "two" }], totalItems: 3 },
    { items: [{ userDefinedId: "three" }], totalItems: 3 },
  ];
  const client = createSnipcartClient({
    apiKey: "test",
    fetchImpl: async (url) => {
      urls.push(url);
      return Response.json(pages.shift());
    },
  });

  const products = await client.listAllProducts({ limit: 2 });
  assert.deepEqual(products.map((product) => product.userDefinedId), [
    "one",
    "two",
    "three",
  ]);
  assert.match(urls[0], /limit=2&offset=0$/);
  assert.match(urls[1], /limit=2&offset=2$/);
});

test("crawl honors Retry-After and bounds 429 retries", async () => {
  const delays = [];
  let calls = 0;
  const client = createSnipcartClient({
    apiKey: "test",
    sleep: async (delay) => delays.push(delay),
    logger: { warn() {} },
    fetchImpl: async () => {
      calls += 1;
      if (calls === 1) {
        return new Response("slow down", {
          status: 429,
          headers: { "Retry-After": "2" },
        });
      }
      return Response.json([{ userDefinedId: "new-product" }]);
    },
  });

  assert.deepEqual(await client.crawlUrl("https://tommyday.com/shop/"), [
    { userDefinedId: "new-product" },
  ]);
  assert.deepEqual(delays, [2_000]);
  assert.equal(calls, 2);
});

test("crawl stops after the configured 429 retry limit", async () => {
  let calls = 0;
  const client = createSnipcartClient({
    apiKey: "test",
    sleep: async () => {},
    logger: { warn() {} },
    fetchImpl: async () => {
      calls += 1;
      return new Response("slow down", { status: 429 });
    },
  });

  await assert.rejects(
    client.crawlUrl("https://tommyday.com/shop/"),
    /failed \(429\)/
  );
  assert.equal(calls, 5);
});

test("permanent errors are not retried or leaked without bounds", async () => {
  let calls = 0;
  const client = createSnipcartClient({
    apiKey: "test",
    fetchImpl: async () => {
      calls += 1;
      return new Response("x".repeat(1_000), { status: 422 });
    },
  });

  await assert.rejects(
    client.crawlUrl("https://tommyday.com/shop/"),
    /Snipcart API POST.*422/
  );
  assert.equal(calls, 1);
});

test("documented stock fields and inventory management state are used", () => {
  assert.equal(getTrackedStock({ stock: 0, totalStock: 9 }), 0);
  assert.equal(getTrackedStock({ totalStock: 3 }), 3);
  assert.equal(
    getTrackedStock({ inventoryManagementMethod: "Disabled", stock: 3 }),
    null
  );
  assert.equal(getTrackedStock({ stock: null, totalStock: null }), null);
  assert.equal(getTrackedStock({ quantity: 99 }), null);
  assert.equal(parseRetryAfter("1.5"), 1_500);
});
