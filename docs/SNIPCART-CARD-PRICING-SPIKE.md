# Snipcart Greeting Card Pricing

## Status

The `card5` alternate-price experiment was retired on September 29, 2026.
Greeting cards now use one flat price: `$6` per card, with no minimum quantity
and no bulk discount.

## Storefront product definition

Greeting-card products must use their normal `data-item-price="6"` value. Do
not add `data-item-categories="greeting-card"`, `data-item-price-card5`, or an
`alternatePrices.card5` value for discount purposes.

The five-card builder remains a selection convenience only. It adds the five
underlying inventory-bearing card products to the cart at `$6` each, for a
normal total of `$30`. It does not create an opaque bundle SKU or apply special
pricing.

If a `card5` automatic discount still exists in the Snipcart dashboard, disable
or delete it so legacy products cannot trigger the retired pricing rule.
