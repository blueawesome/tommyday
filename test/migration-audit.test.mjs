import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const formerPreorderIds = [
  "preorder-heaven-and-hell-11x14",
  "preorder-step-into-tomorrow-8x10",
  "preorder-dreams-magic-8x10",
  "preorder-dinner-guest-8x10",
  "preorder-burlington-dream-factory-11x14",
  "preorder-catch-8x10",
  "preorder-smurfs-on-the-ground-8x10",
  "preorder-a-hero",
  "preorder-a-hero-8x10",
  "preorder-greeting-card-5-pack",
];

test("every former preorder SKU remains represented in the unresolved migration audit", async () => {
  const audit = await readFile(
    new URL("../docs/SNIPCART-PRODUCT-MIGRATION.md", import.meta.url),
    "utf8"
  );

  for (const id of formerPreorderIds) {
    assert.match(audit, new RegExp(`\\| \\\`${id}\\\` \\|`), id);
  }
  assert.match(audit, /Requires Tommy confirmation/);
  assert.match(
    audit,
    /does \*\*not\*\* mean delete,[\s\S]*archive, recrawl, restock, or otherwise mutate/i
  );
});
