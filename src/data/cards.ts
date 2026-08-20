import type {
  CardOccasion,
  CardProductLine,
  CardSeason,
  CardTone,
} from "./cardTaxonomies";
import productAvailability from "./productAvailability.json";

export type CardStatus = "available" | "unavailable" | "sold-out" | "retired" | "draft";
export type CardSize = "A2" | "5x7";
export type CardInside = "blank" | "printed-message";

export type GreetingCard = {
  id: string;
  slug: string;
  sku: string;
  title: string;
  shortTitle?: string;
  status: CardStatus;
  price: number;
  compareAtPrice?: number;
  initialInventory?: number;
  inventory?: number;
  trackInventory?: boolean;
  allowOutOfStockPurchases?: boolean;
  frontImage: string;
  thumbnail?: string;
  lifestyleImages?: string[];
  backImage?: string;
  alt: string;
  productLine: CardProductLine;
  relatedArtworkSlug?: string;
  size: CardSize;
  foldedSizeLabel: string;
  envelope: string;
  inside: CardInside;
  insideMessage?: string;
  primaryOccasion?: CardOccasion;
  occasions: CardOccasion[];
  tones: CardTone[];
  seasons?: CardSeason[];
  subjects: string[];
  themes: string[];
  colors?: string[];
  seoTitle?: string;
  seoDescription?: string;
  productDescription: string;
  shortDescription?: string;
  cardBackDescription?: string;
  bundleEligible: boolean;
  featured?: boolean;
  bestseller?: boolean;
  seasonal?: boolean;
  sortOrder?: number;
  snipcartName?: string;
  snipcartDescription?: string;
};

const baseGreetingCards: GreetingCard[] = [
  {
    id: "happy-birthday-dog-card",
    slug: "happy-birthday-dog",
    sku: "TDA-CARD-HAPPY-BIRTHDAY-DOG-001",
    title: "Happy Birthday, Dog",
    shortTitle: "Birthday Dog",
    status: "available",
    price: 7,
    initialInventory: 10,
    trackInventory: true,
    allowOutOfStockPurchases: false,
    frontImage: "/art/collage/dogbday-web.jpg",
    thumbnail: "/art/collage/dogbday-grid.jpg",
    alt: "A funny birthday greeting card with a party dog and birthday cake.",
    productLine: "tommy-day-art",
    size: "A2",
    foldedSizeLabel: "A2 folded card",
    envelope: "Envelope included",
    inside: "blank",
    primaryOccasion: "birthday",
    occasions: ["birthday", "party-host", "just-because", "blank"],
    tones: ["funny", "weird", "absurd"],
    seasons: ["evergreen"],
    subjects: ["dog", "birthday", "party"],
    themes: ["celebration", "party-animal"],
    seoTitle: "Happy Birthday Dog Card | Tommy Day Art",
    seoDescription:
      "A funny blank-inside birthday dog card printed from Tommy Day's analog collage artwork.",
    productDescription:
      "A funny birthday card with a party dog, a cake, and enough awkward room energy to make the mail memorable.",
    shortDescription: "A birthday card for party dogs and people who deserve better cake.",
    bundleEligible: true,
    featured: true,
    bestseller: true,
    sortOrder: 5,
  },
  {
    id: "need-money-now-you-dont-card",
    slug: "need-money-now-you-dont",
    sku: "TDA-CARD-NEED-MONEY-001",
    title: "Need Money? Now You Don't",
    shortTitle: "Need Money?",
    status: "available",
    price: 7,
    initialInventory: 10,
    trackInventory: true,
    allowOutOfStockPurchases: false,
    frontImage: "/art/collage/needmoney-web.jpg",
    thumbnail: "/art/collage/needmoney-grid.jpg",
    alt: "A funny collage greeting card with coins, cash, and the phrase Do You Need Money? Now You Don't.",
    productLine: "tommy-day-art",
    size: "A2",
    foldedSizeLabel: "A2 folded card",
    envelope: "Envelope included",
    inside: "blank",
    primaryOccasion: "thank-you",
    occasions: ["thank-you", "congratulations", "just-because", "blank"],
    tones: ["funny", "deadpan", "weird"],
    seasons: ["evergreen"],
    subjects: ["money", "coins", "cash"],
    themes: ["generosity", "tiny-fortunes"],
    seoTitle: "Need Money Greeting Card | Tommy Day Art",
    seoDescription:
      "A funny blank-inside money card printed from Tommy Day's analog collage artwork.",
    productDescription:
      "A deadpan money card for thank-yous, congratulations, cash gifts, and strange little financial gestures.",
    shortDescription: "A deadpan card for money, thanks, and tiny financial miracles.",
    bundleEligible: true,
    featured: true,
    bestseller: false,
    sortOrder: 8,
  },
  {
    id: "burger-birthday-card",
    slug: "burger-birthday",
    sku: "TDA-CARD-BURGER-BDAY-001",
    title: "Burger Birthday",
    status: "available",
    price: 7,
    initialInventory: 10,
    trackInventory: true,
    allowOutOfStockPurchases: false,
    frontImage: "/art/collage/burger-bday-web.jpg",
    thumbnail: "/art/collage/burger-bday-grid.jpg",
    alt: "A funny burger-themed birthday greeting card.",
    productLine: "tommy-day-art",
    size: "A2",
    foldedSizeLabel: "A2 folded card",
    envelope: "Envelope included",
    inside: "blank",
    primaryOccasion: "birthday",
    occasions: ["birthday", "party-host", "just-because", "blank"],
    tones: ["funny", "weird", "absurd"],
    seasons: ["evergreen"],
    subjects: ["burger", "birthday", "food"],
    themes: ["celebration", "burger-time"],
    seoTitle: "Burger Birthday Card | Tommy Day Art",
    seoDescription:
      "A funny blank-inside burger birthday card printed from Tommy Day's analog collage artwork.",
    productDescription:
      "A funny burger birthday card for people who deserve a little more weird on their special day.",
    shortDescription: "A burger birthday card for deliciously questionable celebrations.",
    bundleEligible: true,
    featured: true,
    bestseller: false,
    sortOrder: 9,
  },
  {
    id: "lets-get-toasted-card",
    slug: "lets-get-toasted",
    sku: "TDA-CARD-TOASTED-001",
    title: "Let's Get Toasted",
    status: "available",
    price: 7,
    initialInventory: 10,
    trackInventory: true,
    allowOutOfStockPurchases: false,
    frontImage: "/art/collage/lets-get-toasted-web.jpg",
    thumbnail: "/art/collage/lets-get-toasted-grid.jpg",
    alt: "A funny analog collage greeting card with toast-themed imagery.",
    productLine: "tommy-day-art",
    relatedArtworkSlug: "lets-get-toasted",
    size: "A2",
    foldedSizeLabel: "A2 folded card",
    envelope: "Envelope included",
    inside: "blank",
    primaryOccasion: "birthday",
    occasions: ["birthday", "party-host", "just-because", "blank"],
    tones: ["funny", "weird", "absurd"],
    seasons: ["evergreen"],
    subjects: ["food", "toast", "party"],
    themes: ["celebration", "bad-ideas"],
    seoTitle: "Let's Get Toasted Birthday Card | Tommy Day Art",
    seoDescription:
      "A funny, weird birthday greeting card printed from Tommy Day's analog collage artwork. Blank inside with envelope included.",
    productDescription:
      "A funny analog collage greeting card for birthdays, parties, and people who like their celebration cards a little strange.",
    shortDescription: "A funny card for birthdays, parties, and questionable celebrations.",
    bundleEligible: true,
    featured: true,
    bestseller: true,
    sortOrder: 10,
  },
  {
    id: "the-dinner-guest-card",
    slug: "the-dinner-guest",
    sku: "TDA-CARD-DINNER-GUEST-001",
    title: "The Dinner Guest",
    status: "available",
    price: 7,
    initialInventory: 10,
    trackInventory: true,
    allowOutOfStockPurchases: false,
    frontImage: "/art/collage/the-dinner-guest-web.jpg",
    thumbnail: "/art/collage/the-dinner-guest-grd.jpg",
    alt: "A blank-inside greeting card printed from The Dinner Guest analog collage.",
    productLine: "tommy-day-art",
    relatedArtworkSlug: "the-dinner-guest",
    size: "A2",
    foldedSizeLabel: "A2 folded card",
    envelope: "Envelope included",
    inside: "blank",
    primaryOccasion: "party-host",
    occasions: ["party-host", "thank-you", "friendship", "blank"],
    tones: ["weird", "sincere-ish", "deadpan"],
    seasons: ["evergreen"],
    subjects: ["dinner", "guest", "pterodactyl"],
    themes: ["hosting", "odd-company"],
    seoTitle: "The Dinner Guest Greeting Card | Tommy Day Art",
    seoDescription:
      "A blank-inside art card printed from Tommy Day's The Dinner Guest analog collage.",
    productDescription:
      "A strange dinner-party art card for hosts, guests, thank-yous, and people who enjoy dramatic table settings.",
    shortDescription: "A strange little card for hosts, guests, and dinner table drama.",
    bundleEligible: true,
    featured: false,
    bestseller: false,
    sortOrder: 15,
  },
  {
    id: "dog-smoking-card",
    slug: "dog-smoking",
    sku: "TDA-CARD-DOG-SMOKING-001",
    title: "Dog Smoking",
    shortTitle: "Dog Smoking",
    status: "available",
    price: 7,
    initialInventory: 10,
    trackInventory: true,
    allowOutOfStockPurchases: false,
    frontImage: "/art/collage/dog-smoking-web.jpg",
    thumbnail: "/art/collage/dog-smoking-grid.jpg",
    alt: "A surreal analog collage greeting card with a dog holding a pipe.",
    productLine: "tommy-day-art",
    relatedArtworkSlug: "dog-smoking",
    size: "A2",
    foldedSizeLabel: "A2 folded card",
    envelope: "Envelope included",
    inside: "blank",
    primaryOccasion: "friendship",
    occasions: ["friendship", "thinking-of-you", "just-because", "blank"],
    tones: ["weird", "funny", "deadpan"],
    seasons: ["evergreen"],
    subjects: ["dog", "pipe", "smoking"],
    themes: ["strange-friendship", "absurd-domesticity"],
    seoTitle: "Weird Dog Greeting Card | Tommy Day Art",
    seoDescription:
      "A weird dog greeting card printed from Tommy Day's original analog collage artwork. Blank inside with envelope included.",
    productDescription:
      "A weird hand-cut analog collage greeting card for strange friends, confusing correspondence, and people who appreciate a dog with bad ideas.",
    shortDescription: "For strange friends, odd notes, and people who get it.",
    bundleEligible: true,
    featured: true,
    bestseller: false,
    sortOrder: 20,
  },
  {
    id: "dreams-are-made-of-magic-card",
    slug: "dreams-are-made-of-magic",
    sku: "TDA-CARD-DREAMS-MAGIC-001",
    title: "Dreams Are Made of Magic",
    shortTitle: "Dreams & Magic",
    status: "available",
    price: 7,
    initialInventory: 10,
    trackInventory: true,
    allowOutOfStockPurchases: false,
    frontImage: "/art/collage/dreams-are-made-of-magic-web.jpg",
    thumbnail: "/art/collage/dreams-are-made-of-magic-grid.jpg",
    alt: "A blank-inside greeting card printed from Dreams Are Made of Magic analog collage.",
    productLine: "tommy-day-art",
    relatedArtworkSlug: "dreams-are-made-of-magic",
    size: "A2",
    foldedSizeLabel: "A2 folded card",
    envelope: "Envelope included",
    inside: "blank",
    primaryOccasion: "encouragement",
    occasions: ["encouragement", "congratulations", "thinking-of-you", "blank"],
    tones: ["weird", "gentle", "sincere-ish"],
    seasons: ["evergreen"],
    subjects: ["dreams", "magic", "clown"],
    themes: ["hope", "impossible-things"],
    seoTitle: "Dreams Are Made of Magic Card | Tommy Day Art",
    seoDescription:
      "A blank-inside encouragement card printed from Tommy Day's analog collage artwork.",
    productDescription:
      "A weirdly hopeful blank card for encouragement, congratulations, and people chasing impossible little things.",
    shortDescription: "A weirdly hopeful card for impossible little things.",
    bundleEligible: true,
    featured: true,
    bestseller: false,
    sortOrder: 25,
  },
  {
    id: "cant-nobody-hide-from-god-card",
    slug: "cant-nobody-hide-from-god",
    sku: "TDA-CARD-CANT-HIDE-001",
    title: "Can't Nobody Hide From God",
    status: "available",
    price: 7,
    initialInventory: 10,
    trackInventory: true,
    allowOutOfStockPurchases: false,
    frontImage: "/art/collage/cant-nobody-hide-from-god-web.jpg",
    thumbnail: "/art/collage/cant-nobody-hide-from-god-grid.jpg",
    alt: "A surreal analog collage greeting card with dramatic religious and monster imagery.",
    productLine: "tommy-day-art",
    relatedArtworkSlug: "cant-nobody-hide-from-god",
    size: "A2",
    foldedSizeLabel: "A2 folded card",
    envelope: "Envelope included",
    inside: "blank",
    primaryOccasion: "thinking-of-you",
    occasions: ["thinking-of-you", "encouragement", "friendship", "blank"],
    tones: ["weird", "dark", "absurd"],
    seasons: ["evergreen"],
    subjects: ["monster", "faith", "dramatic"],
    themes: ["cosmic-warning", "encouragement"],
    seoTitle: "Can't Nobody Hide From God Greeting Card | Tommy Day Art",
    seoDescription:
      "A strange blank-inside art card printed from Tommy Day's analog collage work.",
    productDescription:
      "A strange blank-inside card for dramatic encouragement, ominous affection, and hard-to-categorize mail.",
    shortDescription: "A dramatic blank card for encouragement and ominous affection.",
    bundleEligible: true,
    featured: false,
    bestseller: false,
    sortOrder: 30,
  },
  {
    id: "golden-age-gal-card",
    slug: "golden-age-gal",
    sku: "TDA-CARD-GOLDEN-AGE-GAL-001",
    title: "Golden Age Gal",
    status: "available",
    price: 7,
    initialInventory: 10,
    trackInventory: true,
    allowOutOfStockPurchases: false,
    frontImage: "/art/collage/golden-age-gal-web.jpg",
    thumbnail: "/art/collage/golden-age-gal-grid.jpg",
    alt: "A blank-inside greeting card printed from Golden Age Gal analog collage.",
    productLine: "tommy-day-art",
    relatedArtworkSlug: "golden-age-gal",
    size: "A2",
    foldedSizeLabel: "A2 folded card",
    envelope: "Envelope included",
    inside: "blank",
    primaryOccasion: "congratulations",
    occasions: ["congratulations", "friendship", "thinking-of-you", "blank"],
    tones: ["weird", "sincere-ish", "gentle"],
    seasons: ["evergreen"],
    subjects: ["superhero", "golden-age", "collage"],
    themes: ["victory", "admiration"],
    seoTitle: "Golden Age Gal Greeting Card | Tommy Day Art",
    seoDescription:
      "A blank-inside art card printed from Tommy Day's Golden Age Gal analog collage.",
    productDescription:
      "A strange, bright card for congratulations, admiration, friendship, and small heroic moments.",
    shortDescription: "A bright card for odd little victories and heroic friends.",
    bundleEligible: true,
    featured: false,
    bestseller: false,
    sortOrder: 35,
  },
  {
    id: "hang-in-there-card",
    slug: "hang-in-there",
    sku: "TDA-CARD-HANG-IN-001",
    title: "Hang in There",
    status: "available",
    price: 7,
    initialInventory: 10,
    trackInventory: true,
    allowOutOfStockPurchases: false,
    frontImage: "/art/collage/hang-in-there-web.jpg",
    thumbnail: "/art/collage/hang-in-there-grid.jpg",
    alt: "A hand-cut analog collage greeting card with Hang in There artwork.",
    productLine: "tommy-day-art",
    relatedArtworkSlug: "hang-in-there",
    size: "A2",
    foldedSizeLabel: "A2 folded card",
    envelope: "Envelope included",
    inside: "blank",
    primaryOccasion: "encouragement",
    occasions: ["encouragement", "thinking-of-you", "friendship", "blank"],
    tones: ["gentle", "weird", "sincere-ish"],
    seasons: ["evergreen"],
    subjects: ["encouragement", "support", "survival"],
    themes: ["keep-going", "soft-landing"],
    seoTitle: "Hang in There Encouragement Card | Tommy Day Art",
    seoDescription:
      "A blank-inside encouragement card printed from Tommy Day's original analog collage artwork.",
    productDescription:
      "A gentle, odd encouragement card for people doing their best, hanging on, or needing a small paper signal.",
    shortDescription: "A gentle encouragement card for people doing their best.",
    bundleEligible: true,
    featured: true,
    bestseller: false,
    sortOrder: 40,
  },
  {
    id: "somewhere-between-heaven-and-hell-card",
    slug: "somewhere-between-heaven-and-hell",
    sku: "TDA-CARD-HEAVEN-HELL-001",
    title: "Somewhere Between Heaven and Hell",
    shortTitle: "Heaven and Hell",
    status: "available",
    price: 7,
    initialInventory: 10,
    trackInventory: true,
    allowOutOfStockPurchases: false,
    frontImage: "/art/collage/somewhere-between-heaven-and-hell-web.jpg",
    thumbnail: "/art/collage/somewhere-between-heaven-and-hell-grid.jpg",
    alt: "A blank-inside greeting card printed from Somewhere Between Heaven and Hell analog collage.",
    productLine: "tommy-day-art",
    relatedArtworkSlug: "somewhere-between-heaven-and-hell",
    size: "A2",
    foldedSizeLabel: "A2 folded card",
    envelope: "Envelope included",
    inside: "blank",
    primaryOccasion: "thinking-of-you",
    occasions: ["thinking-of-you", "encouragement", "friendship", "blank"],
    tones: ["weird", "gentle", "sincere-ish"],
    seasons: ["evergreen"],
    subjects: ["heaven", "hell", "collage"],
    themes: ["in-between", "care"],
    seoTitle: "Somewhere Between Heaven and Hell Card | Tommy Day Art",
    seoDescription:
      "A blank-inside thinking-of-you card printed from Tommy Day's analog collage artwork.",
    productDescription:
      "A strange and tender blank card for people living somewhere in the middle of it all.",
    shortDescription: "A strange and tender card for people in the middle of it all.",
    bundleEligible: true,
    featured: false,
    bestseller: false,
    sortOrder: 45,
  },
];

type CardAvailabilityOverlay = {
  products?: Record<
    string,
    Partial<Pick<GreetingCard, "status" | "inventory">>
  >;
};

const availabilityOverlay = productAvailability as CardAvailabilityOverlay;

function applyCardAvailabilityOverlay(card: GreetingCard): GreetingCard {
  const override = availabilityOverlay.products?.[card.id];
  const canUseInventoryStatus =
    card.status === "available" || card.status === "sold-out";

  return {
    ...card,
    inventory: override?.inventory ?? card.inventory ?? card.initialInventory,
    ...(override?.status && canUseInventoryStatus ? { status: override.status } : {}),
  };
}

export const greetingCards = baseGreetingCards.map(applyCardAvailabilityOverlay);
