import productAvailability from "./productAvailability.json";

export type PreorderProductType = "print" | "card-pack" | "bundle";
export type PreorderProductStatus = "available" | "sold-out" | "unavailable";

export type PreorderProduct = {
  id: string;
  title: string;
  slug: string;
  artworkSlug?: string;
  showOnPreorderPage?: boolean;
  type: PreorderProductType;
  price: number;
  image: string;
  imageAlt: string;
  size?: string;
  badge?: string;
  description: string;
  includes?: string[];
  isPreorder: true;
  preorderCampaign: string;
  preorderClosesAt: string;
  estimatedShipDate: string;
  preorderNote?: string;
  preorderBonusEligible?: boolean;
  preorderButtonLabel?: string;
  snipcartName?: string;
  snipcartDescription?: string;
  featured?: boolean;
  status?: PreorderProductStatus;
  inventory?: number;
};

type ProductAvailabilityOverlay = {
  products?: Record<string, Partial<Pick<PreorderProduct, "status" | "inventory">>>;
};

const availabilityOverlay = productAvailability as ProductAvailabilityOverlay;

export const launchPreorder = {
  campaign: "launch-preorder",
  closesAt: "2026-06-12",
  estimatedShipDate: "Late June 2026",
  openedAt: "2026-06-03",
};

const basePreorderProducts: PreorderProduct[] = [
  {
    id: "preorder-heaven-and-hell-11x14",
    title: "Somewhere Between Heaven and Hell",
    slug: "heaven-and-hell-11x14-print",
    artworkSlug: "somewhere-between-heaven-and-hell",
    showOnPreorderPage: true,
    type: "print",
    price: 35,
    image: "/art/collage/somewhere-between-heaven-and-hell-web.jpg",
    imageAlt: "Somewhere Between Heaven and Hell collage.",
    size: "11x14 signed print",
    badge: "Pre-Order",
    description: "Signed archival matte print from the launch preorder batch.",
    includes: ["Signed 11x14 print", "Archival quality print", "Free random 5x7 cardstock print included"],
    isPreorder: true,
    preorderCampaign: launchPreorder.campaign,
    preorderClosesAt: launchPreorder.closesAt,
    estimatedShipDate: launchPreorder.estimatedShipDate,
    preorderNote: "Includes one free random 5x7 print on thick cardstock.",
    preorderBonusEligible: true,
    preorderButtonLabel: "Pre-Order Now",
    snipcartName: "Pre-Order: Somewhere Between Heaven and Hell 11x14 Signed Print",
    snipcartDescription:
      "Archival quality signed preorder print. Estimated shipping: Late June 2026. Includes one free random 5x7 print on thick cardstock.",
  },
  {
    id: "preorder-step-into-tomorrow-8x10",
    title: "Step Into Tomorrow",
    slug: "step-into-tomorrow-8x10-print",
    artworkSlug: "step-into-tomorrow",
    showOnPreorderPage: true,
    type: "print",
    price: 25,
    image: "/art/collage/step-into-tomorrow-web.jpg",
    imageAlt: "Step Into Tomorrow collage.",
    size: "8x10 signed print",
    badge: "Pre-Order",
    description: "Archival quality signed print from the launch preorder batch.",
    includes: ["Signed 8x10 print", "Archival quality print", "Free random 5x7 cardstock print included"],
    isPreorder: true,
    preorderCampaign: launchPreorder.campaign,
    preorderClosesAt: launchPreorder.closesAt,
    estimatedShipDate: launchPreorder.estimatedShipDate,
    preorderNote: "Includes one free random 5x7 print on thick cardstock.",
    preorderBonusEligible: true,
    preorderButtonLabel: "Pre-Order Now",
    snipcartName: "Pre-Order: Step Into Tomorrow 8x10 Signed Print",
    snipcartDescription:
      "Archival quality signed preorder print. Estimated shipping: Late June 2026. Includes one free random 5x7 print on thick cardstock.",
  },
  {
    id: "preorder-dreams-magic-8x10",
    title: "Dreams Are Made of Magic",
    slug: "dreams-are-made-of-magic-8x10-print",
    artworkSlug: "dreams-are-made-of-magic",
    showOnPreorderPage: true,
    type: "print",
    price: 25,
    image: "/art/collage/dreams-are-made-of-magic-web.jpg",
    imageAlt: "Dreams Are Made of Magic collage.",
    size: "8x10 signed print",
    badge: "Pre-Order",
    description: "Archival quality signed print from the launch preorder batch.",
    includes: ["Signed 8x10 print", "Archival quality print", "Free random 5x7 cardstock print included"],
    isPreorder: true,
    preorderCampaign: launchPreorder.campaign,
    preorderClosesAt: launchPreorder.closesAt,
    estimatedShipDate: launchPreorder.estimatedShipDate,
    preorderNote: "Includes one free random 5x7 print on thick cardstock.",
    preorderBonusEligible: true,
    preorderButtonLabel: "Pre-Order Now",
    snipcartName: "Pre-Order: Dreams Are Made of Magic 8x10 Signed Print",
    snipcartDescription:
      "Archival quality signed preorder print. Estimated shipping: Late June 2026. Includes one free random 5x7 print on thick cardstock.",
  },
  {
    id: "preorder-dinner-guest-8x10",
    title: "The Dinner Guest",
    slug: "the-dinner-guest-8x10-print",
    artworkSlug: "the-dinner-guest",
    showOnPreorderPage: true,
    type: "print",
    price: 25,
    image: "/art/collage/the-dinner-guest-web.jpg",
    imageAlt: "The Dinner Guest collage.",
    size: "8x10 signed print",
    badge: "Pre-Order",
    description: "Archival quality signed print from the launch preorder batch.",
    includes: ["Signed 8x10 print", "Archival quality print", "Free random 5x7 cardstock print included"],
    isPreorder: true,
    preorderCampaign: launchPreorder.campaign,
    preorderClosesAt: launchPreorder.closesAt,
    estimatedShipDate: launchPreorder.estimatedShipDate,
    preorderNote: "Includes one free random 5x7 print on thick cardstock.",
    preorderBonusEligible: true,
    preorderButtonLabel: "Pre-Order Now",
    snipcartName: "Pre-Order: The Dinner Guest 8x10 Signed Print",
    snipcartDescription:
      "Archival quality signed preorder print. Estimated shipping: Late June 2026. Includes one free random 5x7 print on thick cardstock.",
  },
  {
    id: "preorder-burlington-dream-factory-11x14",
    title: "Burlington Dream Factory",
    slug: "burlington-dream-factory-11x14-print",
    artworkSlug: "burlington-dream-factory",
    showOnPreorderPage: true,
    type: "print",
    price: 35,
    image: "/art/collage/burlington-dream-factory-web.jpg",
    imageAlt: "Burlington Dream Factory collage.",
    size: "11x14 signed print",
    badge: "Pre-Order",
    description: "Archival quality signed print from the launch preorder batch.",
    includes: ["Signed 11x14 print", "Archival quality print", "Free random 5x7 cardstock print included"],
    isPreorder: true,
    preorderCampaign: launchPreorder.campaign,
    preorderClosesAt: launchPreorder.closesAt,
    estimatedShipDate: launchPreorder.estimatedShipDate,
    preorderNote: "Includes one free random 5x7 print on thick cardstock.",
    preorderBonusEligible: true,
    preorderButtonLabel: "Pre-Order Now",
    snipcartName: "Pre-Order: Burlington Dream Factory 11x14 Signed Print",
    snipcartDescription:
      "Archival quality signed preorder print. Estimated shipping: Late June 2026. Includes one free random 5x7 print on thick cardstock.",
  },
  {
    id: "preorder-catch-8x10",
    title: "Catch",
    slug: "catch-8x10-print",
    artworkSlug: "catch",
    showOnPreorderPage: true,
    type: "print",
    price: 25,
    image: "/art/collage/catch-web.jpg",
    imageAlt: "Catch collage.",
    size: "8x10 signed print",
    badge: "Pre-Order",
    description: "Archival quality signed print from the launch preorder batch.",
    includes: ["Signed 8x10 print", "Archival quality print", "Free random 5x7 cardstock print included"],
    isPreorder: true,
    preorderCampaign: launchPreorder.campaign,
    preorderClosesAt: launchPreorder.closesAt,
    estimatedShipDate: launchPreorder.estimatedShipDate,
    preorderNote: "Includes one free random 5x7 print on thick cardstock.",
    preorderBonusEligible: true,
    preorderButtonLabel: "Pre-Order Now",
    snipcartName: "Pre-Order: Catch 8x10 Signed Print",
    snipcartDescription:
      "Archival quality signed preorder print. Estimated shipping: Late June 2026. Includes one free random 5x7 print on thick cardstock.",
  },
  {
    id: "preorder-smurfs-on-the-ground-8x10",
    title: "Smurfs on the Ground",
    slug: "smurfs-on-the-ground-8x10-print",
    artworkSlug: "smurfs-on-the-ground",
    showOnPreorderPage: false,
    type: "print",
    price: 25,
    image: "/art/collage/smurfs-on-the-ground-web.jpg",
    imageAlt: "Smurfs on the Ground collage.",
    size: "8x10 signed print",
    badge: "Pre-Order",
    description: "Archival quality signed print from the launch preorder batch.",
    includes: ["Signed 8x10 print", "Archival quality print", "Free random 5x7 cardstock print included"],
    isPreorder: true,
    preorderCampaign: launchPreorder.campaign,
    preorderClosesAt: launchPreorder.closesAt,
    estimatedShipDate: launchPreorder.estimatedShipDate,
    preorderNote: "Includes one free random 5x7 print on thick cardstock.",
    preorderBonusEligible: true,
    preorderButtonLabel: "Pre-Order Now",
    snipcartName: "Pre-Order: Smurfs on the Ground 8x10 Signed Print",
    snipcartDescription:
      "Archival quality signed preorder print. Estimated shipping: Late June 2026. Includes one free random 5x7 print on thick cardstock.",
  },
  {
    id: "preorder-greeting-card-5-pack",
    title: "Greeting Card 5-Pack",
    slug: "greeting-card-5-pack",
    showOnPreorderPage: true,
    type: "card-pack",
    price: 25,
    image: "/art/placeholders/godzilla-vs-louis-armstrong.jpg",
    imageAlt: "Greeting card pack placeholder.",
    size: "A2 folded cards",
    badge: "Pre-Order",
    description: "A preorder pack of five weird all-occasion folded greeting cards.",
    includes: ["Five A2 folded cards", "Blank inside", "Envelopes included"],
    isPreorder: true,
    preorderCampaign: launchPreorder.campaign,
    preorderClosesAt: launchPreorder.closesAt,
    estimatedShipDate: launchPreorder.estimatedShipDate,
    preorderNote: "Folded cards are blank inside and come with envelopes.",
    preorderButtonLabel: "Pre-Order Now",
    snipcartName: "Pre-Order: Greeting Card 5-Pack",
    snipcartDescription:
      "Preorder 5-pack of A2 folded greeting cards. Blank inside with envelopes included. Estimated shipping: Late June 2026.",
  },
];

function applyPreorderAvailabilityOverlay(product: PreorderProduct): PreorderProduct {
  const override = availabilityOverlay.products?.[product.id];
  if (!override) return product;

  return {
    ...product,
    ...override,
  };
}

export const preorderProducts = basePreorderProducts.map(applyPreorderAvailabilityOverlay);

export const launchPreorderProducts = preorderProducts.filter(
  (product) =>
    product.preorderCampaign === launchPreorder.campaign &&
    product.showOnPreorderPage === true
);

export function getPreorderProductsForArtwork(artworkSlug: string) {
  return preorderProducts.filter((product) => product.artworkSlug === artworkSlug);
}

export const launchPreorderPrints = launchPreorderProducts.filter(
  (product) => product.type === "print"
);

export const launchPreorderCardPacks = launchPreorderProducts.filter(
  (product) => product.type === "card-pack"
);

export const launchPreorderBundles = launchPreorderProducts.filter(
  (product) => product.type === "bundle"
);
