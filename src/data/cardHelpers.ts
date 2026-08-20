import { greetingCards, type GreetingCard } from "./cards";
import { cardOccasions, type CardOccasion } from "./cardTaxonomies";
import { bundlePrices, type BundlePackSize } from "./cardPacks";

export const CARD_BUNDLE_CATEGORY = "greeting-card";
export const CARD_BUNDLE_ALTERNATE_PRICE_LIST = "card5";
export const CARD_BUNDLE_ALTERNATE_PRICE = 6;

export function formatCardPrice(price?: number | null) {
  if (typeof price !== "number") return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getPublishedCards(cards = greetingCards) {
  return cards.filter((card) => card.status !== "draft" && card.status !== "retired");
}

export function getAvailableCards(cards = greetingCards) {
  return cards.filter((card) => card.status === "available");
}

export function getCardBySlug(slug: string) {
  return greetingCards.find((card) => card.slug === slug);
}

export function getCardsByOccasion(occasion: CardOccasion | string) {
  return getAvailableCards().filter((card) =>
    card.occasions.includes(occasion as CardOccasion)
  );
}

export function getBundleEligibleCards(cards = greetingCards) {
  return getAvailableCards(cards).filter((card) => card.bundleEligible);
}

export function getCardsByArtworkSlug(artworkSlug: string) {
  return getAvailableCards().filter((card) => card.relatedArtworkSlug === artworkSlug);
}

export function sortCards(cards: GreetingCard[]) {
  return [...cards].sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
}

export function getFeaturedCards(cards = greetingCards) {
  return sortCards(getAvailableCards(cards).filter((card) => card.featured));
}

export function getRelatedCards(card: GreetingCard, limit = 4) {
  return sortCards(greetingCards)
    .filter((candidate) => candidate.id !== card.id && candidate.status !== "draft")
    .map((candidate) => {
      const occasionScore =
        candidate.occasions.filter((term) => card.occasions.includes(term)).length * 3;
      const toneScore =
        candidate.tones.filter((term) => card.tones.includes(term)).length * 2;
      const subjectScore = candidate.subjects.filter((term) =>
        card.subjects.includes(term)
      ).length;

      return { card: candidate, score: occasionScore + toneScore + subjectScore };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.card);
}

export function getSnipcartCardName(card: GreetingCard) {
  return card.snipcartName || `${card.title} Greeting Card`;
}

export function getSnipcartCardDescription(card: GreetingCard) {
  return (
    card.snipcartDescription ||
    `Blank-inside ${card.foldedSizeLabel} with envelope included.`
  );
}

export function getCardOccasionLabel(occasion: CardOccasion | string) {
  return cardOccasions[occasion as CardOccasion]?.label || occasion;
}

export function getVisibleCardOccasions(card: GreetingCard, limit = 2) {
  const occasions = [
    card.primaryOccasion,
    ...card.occasions.filter((occasion) => occasion !== card.primaryOccasion),
  ].filter(
    (occasion): occasion is CardOccasion =>
      Boolean(occasion) && occasion !== "blank"
  );

  return Array.from(new Set(occasions)).slice(0, limit);
}

export function getCardInsideLabel(card: GreetingCard) {
  if (card.inside === "blank") return "Blank inside";

  return card.insideMessage ? "Printed message inside" : "Message inside";
}

export function getCardPhysicalSpecLine(card: GreetingCard) {
  return [
    getCardInsideLabel(card),
    `${card.size} size`,
    card.envelope,
    "Printed in the USA",
  ].join(" · ");
}

export function getCardProductJson(card: GreetingCard) {
  return {
    id: card.id,
    slug: card.slug,
    sku: card.sku,
    title: card.title,
    price: card.price,
    inventory: card.inventory ?? card.initialInventory,
    image: card.thumbnail || card.frontImage,
    url: new URL(`/cards/${card.slug}/`, "https://tommyday.com").href,
    name: getSnipcartCardName(card),
    description: getSnipcartCardDescription(card),
    categories: [CARD_BUNDLE_CATEGORY],
    alternatePrices: {
      [CARD_BUNDLE_ALTERNATE_PRICE_LIST]: CARD_BUNDLE_ALTERNATE_PRICE,
    },
    occasions: card.occasions,
    tones: card.tones,
    subjects: card.subjects,
    themes: card.themes,
  };
}

export function getBundlePrice(packSize: BundlePackSize | number) {
  return bundlePrices[packSize as BundlePackSize];
}
