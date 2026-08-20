import {
  getSnipcartDescription,
  getSnipcartName,
} from "./artworkHelpers";
import { artworks } from "./artworks";
import {
  CARD_BUNDLE_ALTERNATE_PRICE,
  CARD_BUNDLE_ALTERNATE_PRICE_LIST,
  CARD_BUNDLE_CATEGORY,
  getSnipcartCardDescription,
  getSnipcartCardName,
} from "./cardHelpers";
import { greetingCards } from "./cards";
import {
  getAllowOutOfStockPurchases,
  getEffectiveInventory,
  shouldRenderSnipcartPurchaseControl,
  tracksInventory,
  validatePurchasableInventory,
} from "./productRules";

export const SNIPCART_SITE_URL = "https://tommyday.com";

export type NormalizedSnipcartProduct = {
  id: string;
  url: string;
  price: number;
  name: string;
  description: string;
  image: string;
  type: "original" | "print" | "card" | "bookmark" | "other";
  initialInventory?: number;
  inventory?: number;
  trackInventory: boolean;
  allowOutOfStockPurchases: boolean;
  categories?: string[];
  alternatePrices?: Record<string, number>;
};

function absoluteUrl(path: string) {
  return new URL(path, SNIPCART_SITE_URL).href;
}

export function getNormalizedSnipcartProducts(): NormalizedSnipcartProduct[] {
  const artworkProducts = artworks.flatMap((artwork) =>
    artwork.products
      .filter(shouldRenderSnipcartPurchaseControl)
      .map((product): NormalizedSnipcartProduct => {
        validatePurchasableInventory(product);

        return {
          id: product.id,
          url: absoluteUrl(`/collage/${artwork.slug}/`),
          price: product.price as number,
          name: getSnipcartName(artwork, product),
          description: getSnipcartDescription(artwork, product),
          image: absoluteUrl(artwork.image),
          type: product.type,
          initialInventory: product.initialInventory,
          inventory: getEffectiveInventory(product),
          trackInventory: tracksInventory(product),
          allowOutOfStockPurchases: getAllowOutOfStockPurchases(product),
        };
      })
  );

  const cardProducts = greetingCards
    .filter(shouldRenderSnipcartPurchaseControl)
    .map((card): NormalizedSnipcartProduct => {
      validatePurchasableInventory(card);

      return {
        id: card.id,
        url: absoluteUrl(`/cards/${card.slug}/`),
        price: card.price,
        name: getSnipcartCardName(card),
        description: getSnipcartCardDescription(card),
        image: absoluteUrl(card.frontImage),
        type: "card",
        initialInventory: card.initialInventory,
        inventory: getEffectiveInventory(card),
        trackInventory: tracksInventory(card),
        allowOutOfStockPurchases: getAllowOutOfStockPurchases(card),
        categories: [CARD_BUNDLE_CATEGORY],
        alternatePrices: {
          [CARD_BUNDLE_ALTERNATE_PRICE_LIST]: CARD_BUNDLE_ALTERNATE_PRICE,
        },
      };
    });

  const products = [...artworkProducts, ...cardProducts].sort((a, b) =>
    a.id.localeCompare(b.id)
  );
  const seen = new Set<string>();

  for (const product of products) {
    if (seen.has(product.id)) {
      throw new Error(`Duplicate permanent product ID in normalized catalog: "${product.id}".`);
    }
    seen.add(product.id);
  }

  return products;
}

export function getSnipcartProductCatalog() {
  return {
    version: 1,
    siteUrl: SNIPCART_SITE_URL,
    products: getNormalizedSnipcartProducts(),
  };
}
