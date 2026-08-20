# Snipcart Product Registration and Inventory

## Data ownership

- Permanent TypeScript catalogs define identity, storefront content, price, and
  one-time `initialInventory`.
- Snipcart owns current live inventory after registration.
- `src/data/productAvailability.json` mirrors live inventory back into the
  static storefront.
- `dist/snipcart-product-catalog.json` is generated from the same normalized
  products and purchase predicate used by the storefront.

`initialInventory` is never a restock instruction. A normal product sync and
`--force` never reapply it to existing Snipcart products.

## Environment

- `PUBLIC_SNIPCART_API_KEY` is needed during a production build so active
  purchase controls are rendered and validated.
- `SNIPCART_SECRET_API_KEY` selects the Test or Live catalog for command-line
  API calls.
- `SNIPCART_SITE_URL` optionally overrides the public origin and defaults to
  `https://tommyday.com`.

Never put a secret key in source, generated HTML, screenshots, logs, or
committed environment files.

## Manual Test-first launch

Build and deploy before asking Snipcart to crawl the new URLs:

```sh
npm run build
# Deploy dist to Cloudflare Pages.

SNIPCART_SECRET_API_KEY=... npm run sync:snipcart-products -- --dry-run
SNIPCART_SECRET_API_KEY=... npm run sync:snipcart-products

# This manual second run should report no missing products and no inventory updates.
SNIPCART_SECRET_API_KEY=... npm run sync:snipcart-products
```

Use the Test secret key first. Verify imported products and inventory in the
Test dashboard before repeating a dry run and real run with the Live key.

Useful flags:

- `--dry-run`: compare and report without POST or PUT calls.
- `--force`: recrawl every current product URL; existing inventory is untouched.
- `--verbose`: print crawl diagnostics without secrets.

A dry run without a secret key still validates and prints the local manifest,
but cannot compare it with Snipcart.

## Stock reconciliation

```sh
SNIPCART_SECRET_API_KEY=... npm run sync:snipcart-stock -- --dry-run
SNIPCART_SECRET_API_KEY=... npm run sync:snipcart-stock
```

The command paginates the full product list and updates only recognized current
products or existing inventory overlays. It does not revive archive-only,
retired, unavailable, or other deliberately unavailable products.

## Deliberate restocking

Preview one absolute stock change:

```sh
SNIPCART_SECRET_API_KEY=... npm run set:snipcart-stock -- dog-smoking-card 50 --dry-run
```

Apply it:

```sh
SNIPCART_SECRET_API_KEY=... npm run set:snipcart-stock -- dog-smoking-card 50 --confirm
```

The command reads current stock first and updates only inventory fields for the
named product.

## Greeting-card bundle contract

Launch bundle pricing is a Snipcart Test-mode spike for one offer: any 5
qualifying greeting cards for $30.

The implementation must:

- add the underlying stable card IDs and selected quantities to Snipcart through
  individual card line items;
- support repeated selections of the same card design;
- preserve a bundle group identifier for fulfillment;
- define the `greeting-card` category and `card5` alternate price on every
  qualifying card product;
- use synchronized card inventory for selection limits before launch;
- rely on Snipcart component stock for final oversell protection; and
- never use a single opaque bundle SKU as the inventory record.

The native automatic discount must be proven in Snipcart Test mode before this
pricing behavior is treated as launch-safe.
