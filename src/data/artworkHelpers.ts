import type { Artwork, ArtworkProduct, ProductType } from "./artworks";

export function getAvailableProducts(artwork: Artwork) {
  return artwork.products.filter((product) => product.status === "available");
}

export function getUnavailableProducts(artwork: Artwork) {
  return artwork.products.filter((product) => product.status !== "available");
}

export function hasAvailableProducts(artwork: Artwork) {
  return getAvailableProducts(artwork).length > 0;
}

export function hasAvailableProductType(artwork: Artwork, type: ProductType) {
  return artwork.products.some(
    (product) => product.type === type && product.status === "available"
  );
}

export function hasSoldOriginal(artwork: Artwork) {
  return artwork.products.some(
    (product) => product.type === "original" && product.status === "sold"
  );
}

export function getLowestAvailablePrice(artwork: Artwork) {
  const prices = getAvailableProducts(artwork)
    .map((product) => product.price)
    .filter((price): price is number => typeof price === "number");

  if (!prices.length) return null;

  return Math.min(...prices);
}

export function formatPrice(price?: number | null) {
  if (typeof price !== "number") return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getAvailabilityLabel(artwork: Artwork) {
  const availableProducts = getAvailableProducts(artwork);
  const hasOriginal = hasAvailableProductType(artwork, "original");
  const hasPrint = hasAvailableProductType(artwork, "print");
  const hasCard = hasAvailableProductType(artwork, "card");
  const hasBookmark = hasAvailableProductType(artwork, "bookmark");
  const lowest = getLowestAvailablePrice(artwork);

  if (hasOriginal && availableProducts.length > 1) return "Original + more available";
  if (hasOriginal) return "Original available";
  if (hasPrint && hasCard) return `Prints + cards from ${formatPrice(lowest)}`;
  if (hasPrint) return `Prints from ${formatPrice(lowest)}`;
  if (hasCard || hasBookmark) return `Available from ${formatPrice(lowest)}`;
  if (hasSoldOriginal(artwork)) return "Original sold";

  return "Not currently available";
}

export function getArchiveStatusLabel(artwork: Artwork) {
  const hasOriginal = hasAvailableProductType(artwork, "original");
  const hasPrint = hasAvailableProductType(artwork, "print");
  const hasCard = hasAvailableProductType(artwork, "card");
  const hasBookmark = hasAvailableProductType(artwork, "bookmark");

  if (hasOriginal && (hasPrint || hasCard || hasBookmark)) {
    return "Original + editions available";
  }
  if (hasOriginal) return "Original available";
  if (hasPrint && hasCard) return "Prints + cards available";
  if (hasPrint) return "Prints available";
  if (hasCard && hasBookmark) return "Cards + bookmarks available";
  if (hasCard) return "Cards available";
  if (hasBookmark) return "Bookmarks available";
  if (hasSoldOriginal(artwork)) return "Original sold";

  return "Archive only";
}

export function getAvailableProductSummary(artwork: Artwork) {
  const labels = getAvailableProducts(artwork).map((product) => product.label);

  if (labels.length === 0) return "Not currently available";
  if (labels.length <= 2) return `Available as: ${labels.join(", ")}`;

  return `Available as: ${labels.slice(0, 2).join(", ")} + more`;
}

export function getArtworkScopeStatus(artwork: Artwork) {
  if (hasAvailableProducts(artwork)) return "available";
  if (hasSoldOriginal(artwork)) return "sold";
  return "archive";
}

export function getDetailPageDescription(artwork: Artwork) {
  if (!hasAvailableProducts(artwork)) {
    return artwork.description || "Analog collage by Tommy Day.";
  }

  const labels = getAvailableProducts(artwork)
    .map((product) => product.label)
    .join(" and ");

  return artwork.description || `Analog collage by Tommy Day. Available as ${labels}.`;
}

export function getProductDisplayPrice(product: ArtworkProduct) {
  return formatPrice(product.price);
}

export function getSnipcartName(artwork: Artwork, product: ArtworkProduct) {
  return product.snipcartName || `${artwork.title} — ${product.label}`;
}

export function getSnipcartDescription(artwork: Artwork, product: ArtworkProduct) {
  return (
    product.snipcartDescription ||
    artwork.description ||
    `${artwork.medium} by Tommy Day.`
  );
}
