import assert from "node:assert/strict";
import test from "node:test";
import {
  getEffectiveInventory,
  shouldRenderSnipcartPurchaseControl,
  validatePurchasableInventory,
} from "../src/data/productRules.ts";
import { validateManifestProduct } from "../scripts/lib/product-catalog.mjs";

const excludedStatuses = [
  "draft",
  "unavailable",
  "retired",
  "sold",
  "sold-out",
  "archive-only",
];

test("only an available priced internal product renders a Snipcart control", () => {
  const base = { id: "example", status: "available", price: 10 };

  assert.equal(shouldRenderSnipcartPurchaseControl(base), true);
  for (const status of excludedStatuses) {
    assert.equal(
      shouldRenderSnipcartPurchaseControl({ ...base, status }),
      false,
      status
    );
  }
  assert.equal(
    shouldRenderSnipcartPurchaseControl({ ...base, externalUrl: "https://example.com" }),
    false
  );
  assert.equal(
    shouldRenderSnipcartPurchaseControl({ ...base, price: undefined }),
    false
  );
});

test("inventory validation is scoped to active tracked purchase controls", () => {
  assert.doesNotThrow(() =>
    validatePurchasableInventory({
      id: "zero",
      status: "available",
      price: 10,
      initialInventory: 0,
    })
  );

  for (const initialInventory of [undefined, -1, 1.5, "2"]) {
    assert.throws(
      () =>
        validatePurchasableInventory({
          id: "invalid",
          status: "available",
          price: 10,
          initialInventory,
        }),
      /initialInventory/
    );
  }

  for (const status of excludedStatuses) {
    assert.doesNotThrow(() =>
      validatePurchasableInventory({
        id: status,
        status,
        price: 10,
      })
    );
  }
  assert.doesNotThrow(() =>
    validatePurchasableInventory({
      id: "untracked",
      status: "available",
      price: 10,
      trackInventory: false,
    })
  );
});

test("synchronized inventory overlays initial inventory, including zero", () => {
  assert.equal(
    getEffectiveInventory({
      id: "example",
      status: "available",
      initialInventory: 5,
      inventory: 0,
    }),
    0
  );
  assert.equal(
    getEffectiveInventory({
      id: "example",
      status: "available",
      initialInventory: 5,
    }),
    5
  );
});

test("manifest validation rejects invalid tracked starting inventory", () => {
  const base = {
    id: "example",
    url: "https://tommyday.com/shop/",
    price: 10,
    trackInventory: true,
  };

  assert.doesNotThrow(() => validateManifestProduct({ ...base, initialInventory: 0 }));
  for (const initialInventory of [undefined, -1, 0.5, "1"]) {
    assert.throws(
      () => validateManifestProduct({ ...base, initialInventory }),
      /initialInventory/
    );
  }
});
