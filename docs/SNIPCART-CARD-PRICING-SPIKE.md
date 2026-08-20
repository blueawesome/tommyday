# Snipcart Greeting Card Pricing Spike

## Goal

Prove in the Snipcart Test environment that native automatic discounts can support
the launch greeting-card offer: any 5 qualifying greeting cards for $30.

Each greeting card must remain its own inventory-bearing Snipcart product ID. Do
not use an opaque bundle SKU for inventory.

## Storefront product definition

Every qualifying greeting-card product must define:

- `data-item-categories="greeting-card"`
- `data-item-price-card5="6.00"`

Cards added through the Snipcart JavaScript SDK must include:

```js
{
  categories: ["greeting-card"],
  alternatePrices: {
    card5: 6,
  },
}
```

## Test discount setup

Configure this manually in the Snipcart Test dashboard first:

- Trigger: cart contains some products from category `greeting-card`
- Minimum qualifying greeting-card merchandise: `$35`
- Action: alternate price list `card5`
- Customer-facing code entry: none; discount should apply automatically

Do not use `QuantityOfAProduct`, because the 5 cards may be mixed across
multiple card SKUs.

## Required test carts

- 4 mixed cards: no alternate price.
- 5 mixed cards: qualifying cards become `$6` each; card total `$30`.
- 5 duplicate cards: one card SKU quantity `5`; card total `$30`.
- 6 cards: record actual behavior. Native alternate pricing may total `$36`.
- 10 cards: expected `$60` if alternate pricing applies to all qualifying cards.
- Cards plus print/original: only `greeting-card` items receive alternate price.

Watch for discount loops: after the alternate price drops 5 cards from `$35` to
`$30`, Snipcart must not remove and reapply the discount repeatedly.

## Order and inventory verification

Complete a Test order and confirm:

- Line items preserve individual card product IDs.
- Duplicate designs remain a single product ID with the correct quantity.
- No bundle product ID replaces the selected cards.
- The existing webhook/order reconciliation decrements each card design by its
actual purchased quantity.

If this native setup fails, only then consider client-side automatic discount
application. Never expose `SNIPCART_SECRET_API_KEY` in Astro or browser
JavaScript.
