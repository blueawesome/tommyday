export type CardPackType = "curated" | "build-your-own" | "grab-bag";

export type CardPack = {
  id: string;
  slug: string;
  sku: string;
  title: string;
  type: CardPackType;
  status: "available" | "unavailable" | "sold-out" | "retired";
  price: number;
  compareAtPrice?: number;
  cardCount: number;
  cardSlugs?: string[];
  allowedOccasions?: string[];
  image: string;
  thumbnail?: string;
  alt: string;
  description: string;
  shortDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  seasonal?: boolean;
  sortOrder?: number;
};

export const bundlePrices = {
  5: 30,
} as const;

export type BundlePackSize = keyof typeof bundlePrices;

export const cardPacks: CardPack[] = [
  {
    id: "build-your-own-5-card-pack",
    slug: "build-your-own-5-card-pack",
    sku: "TDA-CARD-PACK-BYO-5",
    title: "Build Your Own 5-Card Pack",
    type: "build-your-own",
    status: "unavailable",
    price: 30,
    compareAtPrice: 35,
    cardCount: 5,
    image: "/art/collage/lets-get-toasted-grid.jpg",
    alt: "A stack of Tommy Day analog collage greeting cards.",
    description:
      "Pick any 5 greeting cards and save. Good for birthdays, thank-yous, strange friends, awkward occasions, and future emergencies.",
    shortDescription: "Pick any 5 greeting cards for $30.",
    featured: true,
    sortOrder: 10,
  },
  {
    id: "weird-birthday-5-pack",
    slug: "weird-birthday-5-pack",
    sku: "TDA-CARD-PACK-BDAY-5",
    title: "Weird Birthday 5-Pack",
    type: "curated",
    status: "unavailable",
    price: 30,
    compareAtPrice: 35,
    cardCount: 5,
    cardSlugs: ["lets-get-toasted"],
    image: "/art/collage/lets-get-toasted-grid.jpg",
    alt: "A weird birthday greeting card pack.",
    description:
      "Five weird birthday cards for people who deserve better than the sad grocery-store card wall.",
    shortDescription: "A strange little birthday reserve, coming soon.",
    featured: true,
    sortOrder: 20,
  },
];
