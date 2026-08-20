import assert from "node:assert/strict";
import test from "node:test";
import {
  collectSnipcartMarkup,
  validateCatalogAgainstMarkup,
} from "../scripts/validate-snipcart-build.mjs";

const catalog = {
  version: 1,
  siteUrl: "https://tommyday.com",
  products: [
    {
      id: "example-original",
      url: "https://tommyday.com/collage/example/",
      price: 100,
      initialInventory: 1,
      allowOutOfStockPurchases: false,
    },
    {
      id: "example-card",
      url: "https://tommyday.com/cards/example/",
      price: 7,
      initialInventory: 25,
      allowOutOfStockPurchases: false,
      categories: ["greeting-card"],
      alternatePrices: {
        card5: 6,
      },
    },
  ],
};

const button = ({
  id = "example-original",
  url = "/collage/example/",
  price = "100",
  inventory = "1",
  allow = "false",
} = {}) => `
  <button
    class="button snipcart-add-item"
    data-item-id="${id}"
    data-item-url="${url}"
    data-item-price="${price}"
    data-initial-inventory="${inventory}"
    data-allow-out-of-stock-purchases="${allow}">
  </button>`;

const cardButton = ({
  id = "example-card",
  url = "/cards/example/",
  price = "7",
  inventory = "25",
  allow = "false",
  categories = "greeting-card",
  card5 = "6",
} = {}) => `
  <button
    class="button snipcart-add-item"
    data-item-id="${id}"
    data-item-url="${url}"
    data-item-price="${price}"
    data-item-categories="${categories}"
    data-item-price-card5="${card5}"
    data-initial-inventory="${inventory}"
    data-allow-out-of-stock-purchases="${allow}">
  </button>`;

function collect(html, source = "test.html") {
  return collectSnipcartMarkup(html, {
    source,
    siteUrl: catalog.siteUrl,
  });
}

const originalOnlyCatalog = {
  ...catalog,
  products: [catalog.products[0]],
};

test("manifest and rendered markup validate deterministically", () => {
  const definitions = collect(button() + cardButton());
  assert.deepEqual(validateCatalogAgainstMarkup(catalog, definitions), {
    products: 2,
    markupDefinitions: 2,
  });
});

test("validator catches mismatches and markup absent from the manifest", () => {
  assert.throws(
    () => validateCatalogAgainstMarkup(catalog, collect(button({ price: "99" }))),
    /Price mismatch/
  );
  assert.throws(
    () =>
      validateCatalogAgainstMarkup(
        catalog,
        collect(button() + button({ id: "unexpected" }))
      ),
    /absent from the generated manifest/
  );
});

test("duplicate markup must agree on URL, price, inventory, and policy", () => {
  assert.doesNotThrow(() =>
    validateCatalogAgainstMarkup(originalOnlyCatalog, [
      ...collect(button(), "one.html"),
      ...collect(button(), "two.html"),
    ])
  );
  assert.throws(
    () =>
      validateCatalogAgainstMarkup(originalOnlyCatalog, [
        ...collect(button(), "one.html"),
        ...collect(button({ inventory: "2" }), "two.html"),
      ]),
    /Conflicting markup/
  );
});

test("missing rendered controls produce a public-key diagnostic", () => {
  assert.throws(
    () => validateCatalogAgainstMarkup(catalog, []),
          /PUBLIC_SNIPCART_API_KEY/
  );
});

test("validator catches greeting-card category and alternate price mismatches", () => {
  assert.throws(
    () =>
      validateCatalogAgainstMarkup(
        catalog,
        collect(button() + cardButton({ categories: "other-category" }))
      ),
    /Category mismatch/
  );
  assert.throws(
    () =>
      validateCatalogAgainstMarkup(
        catalog,
        collect(button() + cardButton({ card5: "5" }))
      ),
    /Alternate price mismatch/
  );
});
