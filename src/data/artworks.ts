export type PurchaseOptionType =
  | "original"
  | "print"
  | "card"
  | "bookmark"
  | "other";

export type PurchaseOption = {
  type: PurchaseOptionType;

  // Human-readable label shown on the detail page.
  // Examples: "Original", "8x10 Print", "5x7 Print", "Greeting Card", "Bookmark"
  label: string;

  // Optional display details
  price?: string;
  size?: string;
  url?: string;
  note?: string;
};

export type Artwork = {
  slug: string;
  catalogId: string;
  title: string;
  year: string;
  medium: string;
  dimensions?: string;

  image: string;
  thumbnail?: string;
  alt: string;
  imageAspect?: "portrait" | "landscape" | "square" | "free";

  featured?: boolean;
  draft?: boolean;

  // Broad status used for top-level filtering
  status?: "available" | "sold";

  description?: string;

  purchaseOptions: PurchaseOption[];

  filters: {
    availability: Array<"original" | "print" | "sold" | "not-for-sale">;
    subjects?: string[];
    themes?: string[];
    formats?: string[];
    sizes?: string[];
    colors?: string[];
  };
};

export const artworks: Artwork[] = [
  {
    slug: "untitled-001",
    catalogId: "TD-001",
    title: "Untitled",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/the-og.jpg",
    alt: "Untitled collage (placeholder)",
    imageAspect: "free",
    featured: true,
    status: 'sold',
    purchaseOptions: [],
    filters: { availability: ["not-for-sale"], sizes: ["5x7"] },
  },

  {
    slug: "june-1985",
    catalogId: "TD-002",
    title: "June 1985",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/june-1985.jpg",
    alt: "June 1985 (placeholder)",
    imageAspect: "landscape",
    featured: true,
    status: 'available',
    purchaseOptions: [
      { type: 'print', label: '8x10 Print', size: '8x10', price: '$20', url: '#' },
      { type: 'card', label: 'Greeting Card', price: '$6', url: '#' }
    ],
    filters: { availability: ["print"], sizes: ["4x6"], formats: ["greeting-card"] },
  },

  {
    slug: "heaven-and-hell",
    catalogId: "TD-003",
    title: "Somewhere Between Heaven and Hell",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/heaven-and-hell.jpg",
    alt: "Somewhere Between Heaven and Hell (placeholder)",
    imageAspect: "landscape",
    featured: true,
    status: 'sold',
    purchaseOptions: [],
    filters: { availability: ["not-for-sale"], sizes: ["8x10"], formats: ["print"] },
  },

  {
    slug: "step-into-tomorrow",
    catalogId: "TD-004",
    title: "Step into Tomorrow",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/step-into-tomorrow.jpg",
    alt: "Step into Tomorrow (placeholder)",
    imageAspect: "landscape",
    featured: true,
    status: 'sold',
    purchaseOptions: [],
    filters: { availability: ["not-for-sale"], sizes: ["8x10"], formats: ["bookmark"] },
  },

  {
    slug: "elephant",
    catalogId: "TD-005",
    title: "Pink Elephant",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/elephant.jpg",
    alt: "Pink Elephant (placeholder)",
    imageAspect: "square",
    featured: true,
    status: 'sold',
    purchaseOptions: [],
    filters: { availability: ["not-for-sale"], sizes: ["8x8"], formats: ["greeting-card"] },
  },

  {
    slug: "star-boy",
    catalogId: "TD-006",
    title: "Star Boy",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/star-boy.jpg",
    alt: "Star Boy (placeholder)",
    imageAspect: "landscape",
    featured: true,
    status: 'available',
    purchaseOptions: [
      { type: 'print', label: '5x7 Print', size: '5x7', price: '$18', url: '#' },
      { type: 'card', label: 'Greeting Card', price: '$6', url: '#' }
    ],
    filters: { availability: ["print"], sizes: ["5x7"], formats: ["greeting-card"] },
  },

  {
    slug: "jetpack-man",
    catalogId: "TD-007",
    title: "The Descent",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/jetpack-man.jpg",
    alt: "The Descent (placeholder)",
    imageAspect: "portrait",
    featured: true,
    status: 'sold',
    purchaseOptions: [],
    filters: { availability: ["not-for-sale"], sizes: ["9x12"], formats: ["print"] },
  },

  {
    slug: "bird",
    catalogId: "TD-008",
    title: "How to Bird",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/bird.jpg",
    alt: "How to Bird (placeholder)",
    imageAspect: "landscape",
    featured: true,
    status: 'sold',
    purchaseOptions: [],
    filters: { availability: ["print"], sizes: ["4x6"], formats: ["bookmark"] },
  },

  {
    slug: "dinner-guest",
    catalogId: "TD-009",
    title: "The Dinner Guest",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/dinner-guest.jpg",
    alt: "The Dinner Guest (placeholder)",
    imageAspect: "portrait",
    featured: true,
    status: 'sold',
    purchaseOptions: [],
    filters: { availability: ["not-for-sale"], sizes: ["5x7"] },
  },

  {
    slug: "calm-lake",
    catalogId: "TD-010",
    title: "Calm Lake",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/calm-lake.jpg",
    alt: "Calm Lake (placeholder)",
    imageAspect: "landscape",
    featured: true,
    status: 'sold',
    purchaseOptions: [],
    filters: { availability: ["print"], sizes: ["11x17"], formats: ["print"] },
  },

  {
    slug: "train",
    catalogId: "TD-011",
    title: "Dream Train",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/train.jpg",
    alt: "Dream Train (placeholder)",
    imageAspect: "landscape",
    featured: true,
    status: 'sold',
    purchaseOptions: [],
    filters: { availability: ["not-for-sale"], sizes: ["8x10"], formats: ["print"] },
  },

  {
    slug: "house",
    catalogId: "TD-012",
    title: "Our House",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/house.jpg",
    alt: "Our House (placeholder)",
    imageAspect: "landscape",
    featured: true,
    status: 'sold',
    purchaseOptions: [],
    filters: { availability: ["not-for-sale"], sizes: ["5x7"] },
  },

  {
    slug: "godzilla-vs-louis-armstrong",
    catalogId: "TD-013",
    title: "Godzilla vs. Louis",
    year: "2026",
    medium: "Analog collage",
    image: "/art/placeholders/godzilla-vs-louis-armstrong.jpg",
    alt: "Godzilla vs. Louis (placeholder)",
    imageAspect: "portrait",
    featured: true,
    status: 'available',
    purchaseOptions: [
      { type: 'original', label: 'Original', price: '$125', url: '#' },
      { type: 'print', label: '5x7 Print', size: '5x7', price: '$22', url: '#' }
    ],
    filters: { availability: ["original"] },
  },
];

export const publishedArtworks = artworks.filter((artwork) => !artwork.draft);

export const featuredArtworks = publishedArtworks.filter(
  (artwork) => artwork.featured
);
