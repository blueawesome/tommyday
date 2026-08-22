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
  /**
   * Starting quantity used only when a genuinely new Snipcart product is registered.
   */
  initialInventory?: number;
  /**
   * Effective live quantity, normally supplied by productAvailability.json.
   */
  inventory?: number;
  trackInventory?: boolean;
  allowOutOfStockPurchases?: boolean;
  limitedRun?: number;
  note?: string;
  shippingCategory?: ShippingCategory;
  externalUrl?: string;
  externalLabel?: string;
  snipcartName?: string;
  snipcartDescription?: string;
  imageId?: string;
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
  IRLsuperHeroes: {
    slug: "irl-super-heroes",
    name: "IRL Super Heroes",
    description: "Collages imagining the secret lives of everyday people as superheroes.",
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
  const canUseInventoryStatus =
    product.status === "available" ||
    product.status === "sold-out" ||
    product.status === "sold";

  return {
    ...product,
    inventory: override?.inventory ?? product.inventory ?? product.initialInventory,
    ...(override?.note ? { note: override.note } : {}),
    ...(override?.status && canUseInventoryStatus ? { status: override.status } : {}),
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
    featured: false,
    price: 0,
    webFilename: "step-into-tomorrow-web.jpg",
    gridFilename: "step-into-tomorrow-grid.jpg",
    additionalProducts: [
      {
        id: "step-into-tomorrow-print-8x10",
        type: "print",
        label: "8x10 Print",
        status: "available",
        price: 25,
        initialInventory: 10,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 10,
        shippingCategory: "flat-print",
      },
    ],
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
    price: 100,
    webFilename: "the-dinner-guest-web.jpg",
    gridFilename: "the-dinner-guest-grd.jpg",
    additionalProducts: [
      {
        id: "the-dinner-guest-print-8x10",
        type: "print",
        label: "8x10 Print",
        status: "available",
        price: 25,
        initialInventory: 10,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 10,
        shippingCategory: "flat-print",
      },
    ],
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
    price: 100,
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
    additionalProducts: [
      {
        id: "somewhere-between-heaven-and-hell-print-8x10",
        type: "print",
        label: "8x10 Print",
        status: "available",
        price: 25,
        initialInventory: 10,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 10,
        shippingCategory: "flat-print",
      },
      {
        id: "somewhere-between-heaven-and-hell-print-11x14",
        type: "print",
        label: "11x14 Print",
        status: "available",
        price: 40,
        initialInventory: 7,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 7,
        shippingCategory: "flat-print",
      },
    ],
  },
  {
    slug: "pink-elephant",
    title: "Pink Elephant",
    catalogId: "TD-006",
    year: "2026",
    dimensions: "10x10",
    aspect: "portrait",
    featured: false,
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
  },
  {
    slug: "june-1985",
    title: "June 1985",
    catalogId: "TD-009",
    year: "2026",
    dimensions: "7x10",
    aspect: "portrait",
    status: "available",
    price: 100,
    webFilename: "june_1985_web.jpg",
    gridFilename: "june_1985_web_grid.jpg",
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
    featured: false,
    status: "available",
    price: 125,
    webFilename: "false-idol-web.jpg",
    gridFilename: "false-idol-grid.jpg",
    additionalProducts: [
      {
        id: "false-idol-print-8x10",
        type: "print",
        label: "8x10 Print",
        status: "available",
        price: 25,
        initialInventory: 10,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 10,
        shippingCategory: "flat-print",
      },
    ],
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
    price: 75,
    webFilename: "dog-smoking-web.jpg",
    gridFilename: "dog-smoking-grid.jpg",
    featured: false,
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
    additionalProducts: [
      {
        id: "catch-print-8x10",
        type: "print",
        label: "8x10 Print",
        status: "available",
        price: 25,
        initialInventory: 10,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 10,
        shippingCategory: "flat-print",
      },
    ],
  },
  {
    slug: "cant-nobody-hide-from-god",
    title: "Can't Nobody Hide From God",
    catalogId: "TD-017",
    year: "2026",
    dimensions: "4.25x5.5",
    featured: false,
    aspect: "landscape",
    status: "unavailable",
    price: 15,
    webFilename: "cant-nobody-hide-from-god-web.jpg",
    gridFilename: "cant-nobody-hide-from-god-grid.jpg",
  },
  {
    slug: "camera-man",
    title: "Camera Man",
    catalogId: "TD-018",
    year: "2026",
    dimensions: "9x12",
    featured: false,
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
    additionalProducts: [
      {
        id: "burlington-dream-factory-print-8x10",
        type: "print",
        label: "8x10 Print",
        status: "available",
        price: 25,
        initialInventory: 10,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 10,
        shippingCategory: "flat-print",
      },
    ],
  },
  {
    slug: "tread-carefully",
    title: "Tread Carefully",
    catalogId: "TD-020",
    year: "2026",
    dimensions: "13.75x10.25",
    aspect: "landscape",
    status: "available",
    featured: false,
    price: 100,
    webFilename: "tread-carefully-web.jpg",
    gridFilename: "tread-carefully-grid.jpg",
    series: artworkSeries.minimalCutStudy,
  },
  {
    slug: "calm-lake",
    title: "Calm Lake",
    catalogId: "TD-021",
    year: "2026",
    dimensions: "13.5x10",
    featured: false,
    aspect: "landscape",
    status: "available",
    price: 100,
    webFilename: "calm-lake-web.jpg",
    gridFilename: "calm-lake-grid.jpg",
    series: artworkSeries.minimalCutStudy,
    additionalProducts: [
      {
        id: "calm-lake-print-8x10",
        type: "print",
        label: "8x10 Print",
        status: "available",
        price: 25,
        initialInventory: 10,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 10,
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
    price: 75,
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
        id: "hang-in-there-print-8x10",
        type: "print",
        label: "8x10 Print",
        status: "available",
        price: 25,
        initialInventory: 10,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 10,
        shippingCategory: "flat-print",
      },
      {
        id: "hang-in-there-print-11x14",
        type: "print",
        label: "11x14 Print",
        status: "available",
        price: 40,
        initialInventory: 7,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 7,
        shippingCategory: "flat-print",
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
    additionalProducts: [
      {
        id: "the-descent-print-8x10",
        type: "print",
        label: "8x10 Print",
        status: "available",
        price: 25,
        initialInventory: 10,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 10,
        shippingCategory: "flat-print",
      },
    ],
  },
  {
    slug: "eyes-of-the-tiger",
    title: "Eyes of the Tiger",
    catalogId: "TD-026",
    year: "2026",
    dimensions: "9x12",
    aspect: "portrait",
    status: "unavailable",
    price: 75,
    webFilename: "eyes-of-the-tiger-web.jpg",
    gridFilename: "eyes-of-the-tiger-grid.jpg",
    series: artworkSeries.minimalCutStudy,
    showInShop: false,
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
  },
  {
    slug: "batter-up",
    title: "Batter Up",
    catalogId: "TD-029",
    year: "2026",
    dimensions: "5x5",
    aspect: "square",
    status: "available",
    price: 75,
    webFilename: "batter-up-web.jpg",
    gridFilename: "batter-up-grid.jpg",
    featured: false,
  },
  {
    slug: "free-car-wash",
    title: "Free Car Wash With Any Fill-Up",
    catalogId: "TD-030",
    year: "2026",
    dimensions: "9x12",
    aspect: "portrait",
    status: "available",
    price: 100,
    webFilename: "free-car-wash-web.jpg",
    gridFilename: "free-car-wash-grid.jpg",
    featured: false,
  },
  {
    slug: "z-man",
    title: "Z-Man",
    catalogId: "TD-031",
    year: "2026",
    dimensions: "9x12",
    aspect: "portrait",
    status: "available",
    price: 100,
    webFilename: "zman-web.jpg",
    gridFilename: "zman-grid.jpg",
    featured: false,
    series: artworkSeries.IRLsuperHeroes,
  },
  {
    slug: "a-hero",
    title: "A Hero",
    catalogId: "TD-032",
    year: "2026",
    dimensions: "9x12",
    aspect: "portrait",
    status: "available",
    price: 125,
    webFilename: "a-hero-web.jpg",
    gridFilename: "a-hero-grid.jpg",
    featured: true,
    series: artworkSeries.IRLsuperHeroes,
  },
  {
    slug: "supernova",
    title: "Supernova",
    catalogId: "TD-033",
    year: "2026",
    dimensions: "6x9",
    aspect: "portrait",
    status: "available",
    price: 75,
    webFilename: "supernova-web.jpg",
    gridFilename: "supernova-grid.jpg",
    featured: false,
    series: artworkSeries.IRLsuperHeroes,
  },
  {
    slug: "golden-age-gal",
    title: "Golden Age Gal",
    catalogId: "TD-034",
    year: "2026",
    dimensions: "9x12",
    aspect: "portrait",
    status: "available",
    price: 150,
    webFilename: "golden-age-gal-web.jpg",
    gridFilename: "golden-age-gal-grid.jpg",
    featured: true,
    series: artworkSeries.IRLsuperHeroes,
    additionalProducts: [
      {
        id: "golden-age-gal-print-8x10",
        type: "print",
        label: "8x10 Print",
        status: "available",
        price: 25,
        initialInventory: 10,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 10,
        shippingCategory: "flat-print",
      },
      {
        id: "golden-age-gal-print-11x14",
        type: "print",
        label: "11x14 Print",
        status: "available",
        price: 40,
        initialInventory: 7,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 7,
        shippingCategory: "flat-print",
      },
    ],
  },
  {
    slug: "ww3",
    title: "WW3",
    catalogId: "TD-035",
    year: "2026",
    dimensions: "9x12",
    aspect: "landscape",
    status: "available",
    price: 125,
    webFilename: "ww3-web.jpg",
    gridFilename: "ww3-grid.jpg",
    featured: true,
    additionalProducts: [
      {
        id: "ww3-print-8x10",
        type: "print",
        label: "8x10 Print",
        status: "available",
        price: 25,
        initialInventory: 10,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 10,
        shippingCategory: "flat-print",
      },
      {
        id: "ww3-print-11x14",
        type: "print",
        label: "11x14 Print",
        status: "available",
        price: 40,
        initialInventory: 7,
        trackInventory: true,
        allowOutOfStockPurchases: false,
        limitedRun: 7,
        shippingCategory: "flat-print",
      },
    ],
  },
  {
    slug: "mothman",
    title: "Mothman",
    catalogId: "TD-036",
    year: "2026",
    dimensions: "9x12",
    aspect: "portrait",
    status: "available",
    price: 100,
    webFilename: "mothman-web.jpg",
    gridFilename: "mothman-grid.jpg",
    featured: true,
  },
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
      initialInventory: row.status === "available" ? 1 : undefined,
      trackInventory: true,
      allowOutOfStockPurchases: false,
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
