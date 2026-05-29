export type ProductType =
  | "original"
  | "print"
  | "card"
  | "bookmark"
  | "other";

export type ProductStatus =
  | "available"
  | "sold"
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
  featured?: boolean;
  draft?: boolean;
  showInGallery?: boolean;
  description?: string;
  products: ArtworkProduct[];
  filters: {
    subjects?: string[];
    themes?: string[];
    formats?: ProductType[];
    sizes?: string[];
    colors?: string[];
  };
};

type ImportedArtworkStatus = "available" | "sold" | "archive-only";

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
  gridFilename: string;
};

const importedArtworkRows: ImportedArtworkRow[] = [
  {
    slug: "untitled",
    title: "Untitled",
    catalogId: "TD-001",
    year: "2026",
    dimensions: "8x10",
    aspect: "portrait",
    status: "sold",
    price: 150,
    webFilename: "untitled-web.jpg",
    gridFilename: "untitled-grid.jpg",
  },
  {
    slug: "step-into-tomorrow",
    title: "Step Into Tomorrow",
    catalogId: "TD-002",
    year: "2026",
    dimensions: "6x9",
    aspect: "landscape",
    status: "available",
    price: 75,
    webFilename: "step-into-tomorrow-web.jpg",
    gridFilename: "step-into-tomorrow-grid.jpg",
  },
  {
    slug: "the-dinner-guest",
    title: "The Dinner Guest",
    catalogId: "TD-003",
    year: "2026",
    dimensions: "6x9",
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
    dimensions: "6x9",
    aspect: "portrait",
    status: "available",
    price: 50,
    webFilename: "such-a-wilderness-web.jpg",
    gridFilename: "such-a-wilderness-grid.jpg",
  },
  {
    slug: "somewhere-between-heaven-and-hell",
    title: "Somewhere Between Heaven and Hell",
    catalogId: "TD-005",
    year: "2026",
    dimensions: "6x9",
    aspect: "portrait",
    status: "available",
    price: 75,
    webFilename: "somewhere-between-heaven-and-hell-web.jpg",
    gridFilename: "somewhere-between-heaven-and-hell-grid.jpg",
  },
  {
    slug: "pink-elephant",
    title: "Pink Elephant",
    catalogId: "TD-006",
    year: "2026",
    dimensions: "6x9",
    aspect: "portrait",
    status: "available",
    price: 75,
    webFilename: "pink-elephant-web.jpg",
    gridFilename: "pink-elephant-grid.jpg",
  },
  {
    slug: "lets-get-toasted",
    title: "Let's Get Toasted",
    catalogId: "TD-007",
    year: "2026",
    dimensions: "6x9",
    aspect: "portrait",
    status: "available",
    price: 75,
    webFilename: "lets-get-toasted-web.jpg",
    gridFilename: "lets-get-toasted-grid.jpg",
  },
  {
    slug: "lady-b-cool",
    title: "Lady B Cool",
    catalogId: "TD-008",
    year: "2026",
    dimensions: "6x9",
    aspect: "portrait",
    status: "available",
    price: 75,
    webFilename: "lady-be-cool-web.jpg",
    gridFilename: "lady-be-cool-grid.jpg",
  },
  {
    slug: "june-1985",
    title: "June 1985",
    catalogId: "TD-009",
    year: "2026",
    dimensions: "8x10",
    aspect: "portrait",
    status: "archive-only",
    webFilename: "june_1985_web.jpg",
    gridFilename: "june_1985_web_grid.jpg",
  },
  {
    slug: "godzilla-vs-louis",
    title: "Godzilla vs. Louis",
    catalogId: "TD-010",
    year: "2026",
    dimensions: "5x7",
    aspect: "landscape",
    status: "available",
    price: 75,
    webFilename: "godzilla-vs-louis-web.jpg",
    gridFilename: "godzilla-vs-louis-grid.jpg",
  },
  {
    slug: "full-moon",
    title: "Full Moon",
    catalogId: "TD-011",
    year: "2026",
    dimensions: "6x9",
    aspect: "portrait",
    status: "available",
    price: 75,
    webFilename: "full-moon-web.jpg",
    gridFilename: "full-moon-grid.jpg",
  },
  {
    slug: "false-idol",
    title: "False Idol",
    catalogId: "TD-012",
    year: "2026",
    dimensions: "6x9",
    aspect: "portrait",
    status: "available",
    price: 75,
    webFilename: "false-idol-web.jpg",
    gridFilename: "false-idol-grid.jpg",
  },
  {
    slug: "dreams-are-made-of-magic",
    title: "Dreams Are Made of Magic",
    catalogId: "TD-013",
    year: "2026",
    dimensions: "6x9",
    aspect: "portrait",
    status: "available",
    price: 75,
    webFilename: "Dreams_Are_Made_of_Magic_web.jpg",
    gridFilename: "Dreams_Are_Made_of_Magic_web_grid.jpg",
  },
  {
    slug: "dream-house",
    title: "Dream House",
    catalogId: "TD-014",
    year: "2026",
    dimensions: "6x9",
    aspect: "landscape",
    status: "available",
    price: 75,
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
  },
  {
    slug: "catch",
    title: "Catch",
    catalogId: "TD-016",
    year: "2026",
    dimensions: "6x9",
    aspect: "landscape",
    status: "available",
    price: 75,
    webFilename: "catch-web.jpg",
    gridFilename: "catch-grid.jpg",
  },
  {
    slug: "cant-nobody-hide-from-god",
    title: "Can't Nobody Hide From God",
    catalogId: "TD-017",
    year: "2026",
    dimensions: "6x9",
    aspect: "landscape",
    status: "available",
    price: 75,
    webFilename: "cant-nobody-hide-from-god-web.jpg",
    gridFilename: "cant-nobody-hide-from-god-grid.jpg",
  },
  {
    slug: "camera-man",
    title: "Camera Man",
    catalogId: "TD-018",
    year: "2026",
    dimensions: "5x7",
    aspect: "portrait",
    status: "available",
    price: 50,
    webFilename: "camera-man-web.jpg",
    gridFilename: "camera-man-grid.jpg",
  },
  {
    slug: "burlington-dream-factory",
    title: "Burlington Dream Factory",
    catalogId: "TD-019",
    year: "2026",
    dimensions: "6x9",
    aspect: "landscape",
    status: "available",
    price: 75,
    webFilename: "burlington-dream-factory-web.jpg",
    gridFilename: "burlington-dream-factory-grid.jpg",
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
      inventory: row.status === "available" ? 1 : 0,
      shippingCategory: "original",
    },
  ];
}

export const artworks: Artwork[] = importedArtworkRows.map((row) => ({
  slug: row.slug,
  catalogId: row.catalogId,
  title: row.title,
  year: row.year,
  medium: "Analog collage",
  dimensions: row.dimensions,
  image: `/art/collage/${row.webFilename}`,
  thumbnail: `/art/collage/${row.gridFilename}`,
  alt: `${row.title} analog collage.`,
  imageAspect: row.aspect,
  featured: true,
  products: getOriginalProducts(row),
  filters: { formats: ["original"], sizes: [row.dimensions] },
}));

export const publishedArtworks = artworks.filter((artwork) => !artwork.draft);

export const galleryArtworks = publishedArtworks.filter(
  (artwork) => artwork.showInGallery !== false
);

export const featuredArtworks = publishedArtworks.filter(
  (artwork) => artwork.featured
);

export const shopArtworks = publishedArtworks.filter((artwork) =>
  artwork.products.some((product) => product.status === "available")
);
