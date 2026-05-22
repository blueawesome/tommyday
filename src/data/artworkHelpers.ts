import type { Artwork } from "./artworks";

export function hasOriginalOption(artwork: Artwork) {
  return artwork.purchaseOptions.some((option) => option.type === "original");
}

export function hasPrintOption(artwork: Artwork) {
  return artwork.purchaseOptions.some((option) => option.type === "print");
}

export function hasAnyPurchaseOption(artwork: Artwork) {
  return artwork.purchaseOptions && artwork.purchaseOptions.length > 0;
}

export function getAvailabilityLabel(artwork: Artwork) {
  const original = hasOriginalOption(artwork);
  const print = hasPrintOption(artwork);

  if (original && print) return "Original + prints available";
  if (original) return "Original available";
  if (print) return "Prints available";

  return "Not currently available";
}
