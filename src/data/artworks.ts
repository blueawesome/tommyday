import productAvailability from "./productAvailability.json";

export type ProductType =
  | "original"
  | "print"
  | "card"
  | "bookmark"
  | "other";

export type ProductStatus =
  | "available"
  | "sold"
  | "sold-out"
  | "coming-soon"
  | "unavailable";

export type ShippingCategory =
  | "flat-card"
  | "flat-print"
  | "original"
  | "framed"
  | "none";

export type ArtworkProduct = {
  id: string;
  type: ProductType;
  label: string;
  status: ProductStatus;
  price?: number;
  compareAtPrice?: number;
  inventory?: number;
  limitedRun?: number;
  note?: string;
  shippingCategory?: ShippingCategory;
  externalUrl?: string;
  externalLabel?: string;
  snipcartName?: string;
  snipcartDescription?: string;
  imageId?: string;
  isPreorder?: boolean;
  preorderCampaign?: string;
  preorderClosesAt?: string;
  estimatedShipDate?: string;
  preorderBadge?: string;
  preorderNote?: string;
  preorderBonusEligible?: boolean;
  preorderButtonLabel?: string;
};

export type ArtworkGalleryImage = {
  id: string;
  src: string;
  alt: string;
  label?: string;
  type?: "artwork" | "detail" | "product" | "lifestyle";
  productIds?: string[];
};

export type ArtworkSeries = {
  slug: string;
  name: string;
  description?: string;
};

export const artworkSeries = {
  minimalCutStudy: {
    slug: "minimal-cut-study",
    name: "Minimal Cut Study",
    description: "Collage work made from a minimal number of cut paper pieces.",
  },
} as const satisfies Record<string, ArtworkSeries>;

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
  galleryImages?: ArtworkGalleryImage[];
  imageAspect?: "portrait" | "landscape" | "square" | "free";
  series?: ArtworkSeries;
  featured?: boolean;
  draft?: boolean;
  showInGallery?: boolean;
  showInShop?: boolean;
  description?: string;
  products: ArtworkProduct[];
  filters: {
    subjects?: string[];
    themes?: string[];
    formats?: ProductType[];
    sizes?: string[];
    series?: string[];
    colors?: string[];
  };
};

type ImportedArtworkStatus = "available" | "sold" | "unavailable" | "archive-only";

type ImportedArtworkRow = {
  slug: string;
  title: string;
  catalogId: string;
  year: string;
  dimensions: string;
  aspect: "portrait" | "landscape" | "square" | "free";
  status: ImportedArtworkStatus;
  price?: number;
  webFilename: string;
  gridFilename?: string;
  imagePath?: string;
  thumbnailPath?: string;
  series?: ArtworkSeries;
  showInGallery?: boolean;
  showInShop?: boolean;
  featured?: boolean;
  additionalProducts?: ArtworkProduct[];
};

type ProductAvailabilityOverlay = {
  products?: Record<string, Partial<Pick<ArtworkProduct, "status" | "inventory" | "note">>>;
};

const availabilityOverlay = productAvailability as ProductAvailabilityOverlay;

function applyAvailabilityOverlay(product: ArtworkProduct): ArtworkProduct {
  const override = availabilityOverlay.products?.[product.id];
  if (!override) return product;

  return {
    ...product,
    ...override,
  };
}

const importedArtworkRows: ImportedArtworkRow[] = [
  {
    slug: "untitled",
    title: "Untitled",
    catalogId: "TD-001",
    year: "2026",
    dimensions: "8.5x11",
    aspect: "portrait",
    status: "unavailable",
    price: 0,
    webFilename: "untitled-web.jpg",
    gridFilename: "untitled-grid.jpg",
    featured: false,
    series: artworkSeries.minimalCutStudy,
  },
  {
    slug: "step-into-tomorrow",
    title: "Step Into Tomorrow",
    catalogId: "TD-002",
    year: "2026",
    dimensions: "9.75x7.5",
    aspect: "landscape",
    status: "unavailable",
    price: 0,
    webFilename: "step-into-tomorrow-web.jpg",
    gridFilename: "step-into-tomorrow-grid.jpg",
  },
  {
    slug: "the-dinner-guest",
    title: "The Dinner Guest",
    catalogId: "TD-003",
    year: "2026",
    dimensions: "8.5x11",
    featured: false,
    aspect: "portrait",
    status: "available",
    price: 75,
    webFilename: "the-dinner-guest-web.jpg",
    gridFilename: "the-dinner-guest-grd.jpg",
  },
  {
    slug: "such-a-wilderness",
    title: "Such a Wilderness",
    catalogId: "TD-004",
    year: "2026",
    dimensions: "8.5x11",
    aspect: "portrait",
    status: "available",
    featured: false,
    price: 75,
    webFilename: "such-a-wilderness-web.jpg",
    gridFilename: "such-a-wilderness-grid.jpg",
  },
  {
    slug: "somewhere-between-heaven-and-hell",
    title: "Somewhere Between Heaven and Hell",
    catalogId: "TD-005",
    year: "2026",
    dimensions: "11x14",
    aspect: "portrait",
    status: "available",
    price: 150,
    webFilename: "somewhere-between-heaven-and-hell-web.jpg",
    gridFilename: "somewhere-between-heaven-and-hell-grid.jpg",

  },
  {
    slug: "pink-elephant",
    title: "Pink Elephant",
    catalogId: "TD-006",
    year: "2026",
    dimensions: "10x10",
    aspect: "portrait",
    status: "available",
    price: 125,
    webFilename: "pink-elephant-web.jpg",
    gridFilename: "pink-elephant-grid.jpg",
  },
  {
    slug: "lets-get-toasted",
    title: "Let's Get Toasted",
    catalogId: "TD-007",
    year: "2026",
    dimensions: "4.25x5.5",
    aspect: "portrait",
    featured: false,
    status: "unavailable",
    price: 15,
    webFilename: "lets-get-toasted-web.jpg",
    gridFilename: "lets-get-toasted-grid.jpg",
    additionalProducts: [
      {
        id: "lets-get-toasted-card",
        type: "card",
        label: "A2 Greeting Card with Envelope",
        status: "coming-soon",
        price: 7,   
      },
    ],
  },
  {
    slug: "june-1985",
    title: "June 1985",
    catalogId: "TD-009",
    year: "2026",
    dimensions: "7x10",
    aspect: "portrait",
    status: "available",
    price: 85,
    webFilename: "june_1985_web.jpg",
    gridFilename: "june_1985_web_grid.jpg",
    additionalProducts: [
      {
        id: "june-1985-print",
        type: "print",
        label: "Print",
        status: "coming-soon",
        price: 7,
      },
    ],
  },
  {
    slug: "louis-vs-the-monster",
    title: "Louis vs. The Monster",
    catalogId: "TD-010",
    year: "2026",
    dimensions: "9x12",
    aspect: "landscape",
    status: "available",
    featured: false,
    price: 75,
    webFilename: "louis-vs-the-monster-web.jpg",
    gridFilename: "louis-vs-the-monster-grid.jpg",
  },
  {
    slug: "full-moon",
    title: "Full Moon",
    catalogId: "TD-011",
    year: "2026",
    dimensions: "11x14",
    aspect: "portrait",
    featured: false,
    status: "available",
    price: 75,
    webFilename: "full-moon-web.jpg",
    gridFilename: "full-moon-grid.jpg",
    series: artworkSeries.minimalCutStudy,
  },
  {
    slug: "false-idol",
    title: "False Idol",
    catalogId: "TD-012",
    year: "2026",
    dimensions: "11x14",
    aspect: "portrait",
    status: "available",
    price: 125,
    webFilename: "false-idol-web.jpg",
    gridFilename: "false-idol-grid.jpg",
  },
  {
    slug: "dreams-are-made-of-magic",
    title: "Dreams Are Made of Magic",
    catalogId: "TD-013",
    year: "2026",
    dimensions: "9x12",
    aspect: "portrait",
    status: "available",
    price: 125,
    webFilename: "dreams-are-made-of-magic-web.jpg",
    gridFilename: "dreams-are-made-of-magic-grid.jpg",
  },
  {
    slug: "dream-house",
    title: "Dream House",
    catalogId: "TD-014",
    year: "2026",
    dimensions: "9x12",
    aspect: "landscape",
    status: "available",
    price: 125,
    webFilename: "dream-house-web.jpg",
    gridFilename: "dream-house-grid.jpg",
  },
  {
    slug: "dog-smoking",
    title: "Dog Smoking",
    catalogId: "TD-015",
    year: "2026",
    dimensions: "6x9",
    aspect: "landscape",
    status: "available",
    price: 50,
    webFilename: "dog-smoking-web.jpg",
    gridFilename: "dog-smoking-grid.jpg",
    additionalProducts: [
      {
        id: "dog-smoking-card",
        type: "card",
        label: "A2 Greeting Card with Envelope",
        status: "coming-soon",
        price: 7,
      },
    ],
  },
  {
    slug: "catch",
    title: "Catch",
    catalogId: "TD-016",
    year: "2026",
    dimensions: "9x12",
    aspect: "landscape",
    status: "available",
    price: 125,
    webFilename: "catch-web.jpg",
    gridFilename: "catch-grid.jpg",
  },
  {
    slug: "cant-nobody-hide-from-god",
    title: "Can't Nobody Hide From God",
    catalogId: "TD-017",
    year: "2026",
    dimensions: "4.25x5.5",
    aspect: "landscape",
    status: "unavailable",
    price: 15,
    webFilename: "cant-nobody-hide-from-god-web.jpg",
    gridFilename: "cant-nobody-hide-from-god-grid.jpg",
    additionalProducts: [
      {
        id: "cant-nobody-hide-from-god-card",
        type: "card",
        label: "A2 Greeting Card with Envelope",
        status: "coming-soon",
        price: 7,
      },
    ],
  },
  {
    slug: "camera-man",
    title: "Camera Man",
    catalogId: "TD-018",
    year: "2026",
    dimensions: "9x12",
    aspect: "portrait",
    status: "available",
    price: 100,
    webFilename: "camera-man-web.jpg",
    gridFilename: "camera-man-grid.jpg",
  },
  {
    slug: "burlington-dream-factory",
    title: "Burlington Dream Factory",
    catalogId: "TD-019",
    year: "2026",
    dimensions: "9x12",
    aspect: "landscape",
    status: "available",
    price: 125,
    webFilename: "burlington-dream-factory-web.jpg",
    gridFilename: "burlington-dream-factory-grid.jpg",
  },
  {
    slug: "tread-carefully",
    title: "Tread Carefully",
    catalogId: "TD-020",
    year: "2026",
    dimensions: "13.75x10.25",
    aspect: "landscape",
    status: "available",
    price: 100,
    webFilename: "tread-carefully-web.jpg",
    gridFilename: "tread-carefully-grid.jpg",
    series: artworkSeries.minimalCutStudy,
    additionalProducts: [
      {
        id: "tread-carefully-print",
        type: "print",
        label: "Print",
        status: "coming-soon",
        note: "Print option may be available for preorder.",
        shippingCategory: "flat-print",
      },
    ],
  },
  {
    slug: "calm-lake",
    title: "Calm Lake",
    catalogId: "TD-021",
    year: "2026",
    dimensions: "13.5x10",
    aspect: "landscape",
    status: "available",
    price: 100,
    webFilename: "calm-lake-web.jpg",
    gridFilename: "calm-lake-grid.jpg",
    series: artworkSeries.minimalCutStudy,
      additionalProducts: [
      {
        id: "calm-lake-print",
        type: "print",
        label: "Print",
        status: "coming-soon",
        note: "Print coming soon!",
        shippingCategory: "flat-print",
      },
    ],
  },
  {
    slug: "smurfs-on-the-ground",
    title: "Smurfs on the Ground",
    catalogId: "TD-022",
    year: "2026",
    dimensions: "9x12",
    aspect: "portrait",
    status: "available",
    price: 50,
    webFilename: "smurfs-on-the-ground-web.jpg",
    showInGallery: false,
    showInShop: false,
    featured: false,
  },
  {
    slug: "star-boy",
    title: "Star Boy",
    catalogId: "TD-023",
    year: "2026",
    dimensions: "9x10",
    aspect: "portrait",
    status: "available",
    price: 50,
    webFilename: "star-boy-web.jpg",
    gridFilename: "star-boy-grid.jpg",
    featured: false,
  },
  {
    slug: "hang-in-there",
    title: "Hang in There",
    catalogId: "TD-024",
    year: "2026",
    dimensions: "11x14",
    aspect: "portrait",
    status: "available",
    price: 100,
    webFilename: "hang-in-there-web.jpg",
    gridFilename: "hang-in-there-grid.jpg",
    featured: false,
    additionalProducts: [
      {
        id: "hang-in-there-card",
        type: "card",
        label: "A2 Greeting Card with Envelope",
        status: "coming-soon",
        price: 7,
      },
    ],
  },
  {
    slug: "the-descent",
    title: "The Descent",
    catalogId: "TD-025",
    year: "2026",
    dimensions: "9x12",
    aspect: "portrait",
    status: "available",
    price: 75,
    webFilename: "the-descent-web.jpg",
    gridFilename: "the-descent-grid.jpg",
    series: artworkSeries.minimalCutStudy,
    featured: false,
  },
  {
    slug: "eyes-of-the-tiger",
    title: "Eyes of the Tiger",
    catalogId: "TD-026",
    year: "2026",
    dimensions: "9x12",
    aspect: "portrait",
    status: "available",
    price: 75,
    webFilename: "eyes-of-the-tiger-web.jpg",
    gridFilename: "eyes-of-the-tiger-grid.jpg",
    series: artworkSeries.minimalCutStudy,
    featured: false,
  },
  {
    slug: "a-dash-of-red",
    title: "A Dash of Red",
    catalogId: "TD-027",
    year: "2026",
    dimensions: "11x14",
    aspect: "portrait",
    status: "available",
    price: 100,
    webFilename: "dash-of-red-web.jpg",
    gridFilename: "dash-of-red-grid.jpg",
    featured: false,
  },
  {
    slug: "chillaz",
    title: "Chillaz",
    catalogId: "TD-028",
    year: "2026",
    dimensions: "6x9",
    aspect: "portrait",
    showInGallery: false,
    showInShop: false,
    status: "available",
    price: 25,
    webFilename: "chillaz-web.jpg",
    featured: false,
  }
];

function getOriginalProducts(row: ImportedArtworkRow): ArtworkProduct[] {
  if (row.status === "archive-only") return [];

  return [
    {
      id: `${row.slug}-original`,
      type: "original",
      label: "Original",
      status: row.status,
      price: row.price,
      inventory: row.status === "available" ? 1 : 0,
      shippingCategory: "original",
    },
  ];
}

export const artworks: Artwork[] = importedArtworkRows.map((row) => {
  const products = [...getOriginalProducts(row), ...(row.additionalProducts || [])].map(
    applyAvailabilityOverlay
  );
  const formats = products
    .map((product) => product.type)
    .filter((format, index, array) => array.indexOf(format) === index);

  return {
    slug: row.slug,
    catalogId: row.catalogId,
    title: row.title,
    year: row.year,
    medium: "Analog collage",
    dimensions: row.dimensions,
    image: row.imagePath ?? `/art/collage/${row.webFilename}`,
    thumbnail: row.thumbnailPath ?? (row.gridFilename ? `/art/collage/${row.gridFilename}` : undefined),
    alt: `${row.title} analog collage.`,
    imageAspect: row.aspect,
    series: row.series,
    featured: row.featured ?? true,
    showInGallery: row.showInGallery,
    showInShop: row.showInShop,
    products,
    filters: {
      formats,
      sizes: [row.dimensions],
      series: row.series ? [row.series.slug] : undefined,
    },
  };
});

export const publishedArtworks = artworks.filter((artwork) => !artwork.draft);

export const galleryArtworks = publishedArtworks.filter(
  (artwork) => artwork.showInGallery !== false
);

export const featuredArtworks = publishedArtworks.filter(
  (artwork) => artwork.featured
);

export const shopArtworks = publishedArtworks.filter((artwork) =>
  artwork.showInShop !== false &&
  artwork.products.some((product) => product.status === "available")
);
