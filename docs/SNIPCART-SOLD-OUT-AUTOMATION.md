# Snipcart Sold-Out Automation

The site is static, so Snipcart checkout needs to mirror purchase state back into the repo.

## Flow

1. Snipcart sends an order webhook to `/api/snipcart-webhook`.
2. The Cloudflare Pages Function validates the request.
3. The function asks the Snipcart Products API for current stock on the purchased item IDs when possible.
4. The function dispatches the `snipcart-order-completed` GitHub workflow with the order payload and any stock data it found.
5. The workflow runs `npm run apply:snipcart-order`, updates `src/data/productAvailability.json`, commits to `main`, and Cloudflare Pages redeploys.

## Required Secrets

Cloudflare Pages:

- `GITHUB_DISPATCH_TOKEN`: GitHub token with permission to dispatch workflows for `blueawesome/tommyday`.
- `GITHUB_REPOSITORY`: Optional. Defaults to `blueawesome/tommyday`.
- `SNIPCART_SECRET_API_KEY`: Preferred validation method for Snipcart request tokens, and used to look up post-checkout product stock.
- `SNIPCART_WEBHOOK_SECRET`: Optional fallback shared secret. If used, include it in the Snipcart webhook URL as `?secret=...`.

GitHub Actions:

- `GITHUB_TOKEN` is provided automatically and is used by the workflow to commit `src/data/productAvailability.json`.
- `SNIPCART_SECRET_API_KEY` is only needed if running `npm run sync:snipcart-stock` from GitHub later.

## Manual Testing

Run a dry-run fixture locally:

```sh
npm run apply:snipcart-order -- --payload /path/to/order.json --dry-run
```

Run a real overlay update locally:

```sh
npm run apply:snipcart-order -- --payload /path/to/order.json
```

Reconcile from Snipcart:

```sh
SNIPCART_SECRET_API_KEY=... npm run sync:snipcart-stock
```

## Status Rules

- Originals bought through Snipcart become `sold`.
- Products with Snipcart stock in the webhook payload are synced to that current stock.
- Restockable products with Snipcart stock or tracked overlay inventory at `0` become `sold-out`.
- Products without Snipcart stock data fall back to tracked overlay inventory when present.
- `sold-out` displays as: `Sold out, but more on the way!`
