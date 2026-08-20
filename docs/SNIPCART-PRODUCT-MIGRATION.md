# Snipcart Product Migration Audit

This document is an audit record, not a product catalog and not an input to any
script. Product discovery comes only from the generated
`dist/snipcart-product-catalog.json`.

“Retire” means remove from the active storefront. It does **not** mean delete,
archive, recrawl, restock, or otherwise mutate the historical Snipcart product.

The old records remain isolated in this audit until every row below receives
Tommy's final decision. They are no longer rendered,
registered, reconciled, or processed as current storefront products.

| Existing Snipcart ID | Current source state | Proposed permanent ID if retained | Decision |
|---|---|---|---|
| `preorder-heaven-and-hell-11x14` | 11×14 print, $35, formerly shown on preorder and artwork pages | `somewhere-between-heaven-and-hell-print-11x14` | **Requires Tommy confirmation:** replace for CatPrint or retire |
| `preorder-step-into-tomorrow-8x10` | 8×10 print, $25, formerly shown on preorder and artwork pages | `step-into-tomorrow-print-8x10` | **Requires Tommy confirmation:** replace for CatPrint or retire |
| `preorder-dreams-magic-8x10` | 8×10 print, $25, formerly shown on preorder and artwork pages | `dreams-are-made-of-magic-print-8x10` | **Requires Tommy confirmation:** replace for CatPrint or retire |
| `preorder-dinner-guest-8x10` | 8×10 print, $25, formerly shown on preorder and artwork pages | `the-dinner-guest-print-8x10` | **Requires Tommy confirmation:** replace for CatPrint or retire |
| `preorder-burlington-dream-factory-11x14` | 11×14 print, $35, formerly shown on preorder and artwork pages | `burlington-dream-factory-print-11x14` | **Requires Tommy confirmation:** replace for CatPrint or retire |
| `preorder-catch-8x10` | 8×10 print, $25, formerly shown on preorder and artwork pages | `catch-print-8x10` | **Requires Tommy confirmation:** replace for CatPrint or retire |
| `preorder-smurfs-on-the-ground-8x10` | 8×10 print, $25; formerly hidden from the preorder page but exposed on its artwork page | `smurfs-on-the-ground-print-8x10` | **Requires Tommy confirmation:** replace for CatPrint or retire |
| `preorder-a-hero` | 11×14 print, $35, formerly shown on preorder and artwork pages | `a-hero-print-11x14` | **Requires Tommy confirmation:** replace for CatPrint or retire |
| `preorder-a-hero-8x10` | 8×10 print, $25, formerly shown on preorder and artwork pages | `a-hero-print-8x10` | **Requires Tommy confirmation:** replace for CatPrint or retire |
| `preorder-greeting-card-5-pack` | $25 placeholder pack, not rendered | None in this task | **Requires Tommy confirmation:** normally retire; never use as opaque bundle inventory |

## Resolution rules

- A confirmed CatPrint product moves into the permanent artwork catalog without
  campaign language.
- Prefer the proposed new ID, leaving the historical `preorder-*` Snipcart
  record untouched.
- Preserve the verified price and size shown above. Do not invent stock.
- If stock is unknown, the permanent product starts as `unavailable` without
  `initialInventory`.
- Activating it later requires a real `initialInventory` count.
- Reusing a historical ID requires separate, explicit authorization from Tommy.

## Greeting-card placeholders

| ID | Previous state | Current phase-one state | Inventory |
|---|---|---|---|
| `lets-get-toasted-card` | `available`, $7 | `available` | Physical count seeded in card catalog |
| `dog-smoking-card` | `available`, $7 | `available` | Physical count seeded in card catalog |
| `cant-nobody-hide-from-god-card` | `available`, $7 | `available` | Physical count seeded in card catalog |
| `hang-in-there-card` | `available`, $7 | `available` | Physical count seeded in card catalog |

These stable IDs are reserved for the individual card designs. Each design will
receive its own starting stock when real inventory arrives.
