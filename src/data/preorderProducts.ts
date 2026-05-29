export type PreorderProductType = "print" | "card-pack" | "bundle";

export type PreorderProduct = {
  id: string;
  title: string;
  slug: string;
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
};

export const launchPreorder = {
  campaign: "launch-preorder",
  closesAt: "2026-06-10",
  estimatedShipDate: "Late June 2026",
  openedAt: "2026-06-03",
};

export const preorderProducts: PreorderProduct[] = [
  {
    id: "preorder-heaven-and-hell-11x14",
    title: "Somewhere Between Heaven and Hell",
    slug: "heaven-and-hell-11x14-print",
    type: "print",
    price: 45,
    image: "/art/placeholders/heaven-and-hell.jpg",
    imageAlt: "Somewhere Between Heaven and Hell collage print placeholder.",
    size: "11x14 signed print",
    badge: "Pre-Order",
    description: "A signed preorder print from the initial Tommy Day Art print batch.",
    includes: ["Signed 11x14 print", "Ships flat", "Mystery 5x7 launch art card included"],
    isPreorder: true,
    preorderCampaign: launchPreorder.campaign,
    preorderClosesAt: launchPreorder.closesAt,
    estimatedShipDate: launchPreorder.estimatedShipDate,
    preorderNote: "Includes one free mystery 5x7 launch art card.",
    preorderBonusEligible: true,
    preorderButtonLabel: "Pre-Order Now",
    snipcartName: "Pre-Order: Somewhere Between Heaven and Hell 11x14 Signed Print",
    snipcartDescription:
      "Signed preorder print. Estimated shipping: Late June 2026. Includes one mystery 5x7 launch art card.",
  },
  {
    id: "preorder-step-into-tomorrow-8x10",
    title: "Step into Tomorrow",
    slug: "step-into-tomorrow-8x10-print",
    type: "print",
    price: 35,
    image: "/art/placeholders/step-into-tomorrow.jpg",
    imageAlt: "Step into Tomorrow collage print placeholder.",
    size: "8x10 signed print",
    badge: "Pre-Order",
    description: "A signed preorder print from the initial Tommy Day Art print batch.",
    includes: ["Signed 8x10 print", "Ships flat", "Mystery 5x7 launch art card included"],
    isPreorder: true,
    preorderCampaign: launchPreorder.campaign,
    preorderClosesAt: launchPreorder.closesAt,
    estimatedShipDate: launchPreorder.estimatedShipDate,
    preorderNote: "Includes one free mystery 5x7 launch art card.",
    preorderBonusEligible: true,
    preorderButtonLabel: "Pre-Order Now",
    snipcartName: "Pre-Order: Step into Tomorrow 8x10 Signed Print",
    snipcartDescription:
      "Signed preorder print. Estimated shipping: Late June 2026. Includes one mystery 5x7 launch art card.",
  },
  {
    id: "preorder-dreams-magic-8-5x11",
    title: "Dreams Are Made of Magic",
    slug: "dreams-are-made-of-magic-8-5x11-print",
    type: "print",
    price: 38,
    image: "/art/placeholders/star-boy.jpg",
    imageAlt: "Dreams Are Made of Magic print placeholder.",
    size: "8.5x11 signed print",
    badge: "Pre-Order",
    description: "A signed preorder print from the initial Tommy Day Art print batch.",
    includes: ["Signed 8.5x11 print", "Ships flat", "Mystery 5x7 launch art card included"],
    isPreorder: true,
    preorderCampaign: launchPreorder.campaign,
    preorderClosesAt: launchPreorder.closesAt,
    estimatedShipDate: launchPreorder.estimatedShipDate,
    preorderNote: "Includes one free mystery 5x7 launch art card.",
    preorderBonusEligible: true,
    preorderButtonLabel: "Pre-Order Now",
    snipcartName: "Pre-Order: Dreams Are Made of Magic 8.5x11 Signed Print",
    snipcartDescription:
      "Signed preorder print. Estimated shipping: Late June 2026. Includes one mystery 5x7 launch art card.",
  },
  {
    id: "preorder-greeting-card-5-pack",
    title: "Greeting Card 5-Pack",
    slug: "greeting-card-5-pack",
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
  {
    id: "preorder-whole-weird-thing-bundle",
    title: "The Whole Dang Thing Bundle",
    slug: "whole-dang-thing-bundle",
    type: "bundle",
    price: 125,
    image: "/art/placeholders/june-1985.jpg",
    imageAlt: "The Whole Dang Thing Bundle placeholder.",
    badge: "Pre-Order Bundle",
    description:
      "For the true sickos, early supporters, and people who do not want to choose.",
    includes: [
      "All preorder prints",
      "One 5-pack of blank A2 greeting cards",
      "Three mystery 5x7 launch art cards",
    ],
    isPreorder: true,
    preorderCampaign: launchPreorder.campaign,
    preorderClosesAt: launchPreorder.closesAt,
    estimatedShipDate: launchPreorder.estimatedShipDate,
    preorderNote:
      "This is a preorder bundle. Printing begins after the preorder window closes.",
    preorderButtonLabel: "Pre-Order Bundle",
    snipcartName: "Pre-Order: The Whole Dang Thing Bundle",
    snipcartDescription:
      "Preorder bundle with all preorder prints, greeting card pack, and three mystery 5x7 launch art cards. Estimated shipping: Late June 2026.",
    featured: true,
  },
];

export const launchPreorderProducts = preorderProducts.filter(
  (product) => product.preorderCampaign === launchPreorder.campaign
);

export const launchPreorderPrints = launchPreorderProducts.filter(
  (product) => product.type === "print"
);

export const launchPreorderCardPacks = launchPreorderProducts.filter(
  (product) => product.type === "card-pack"
);

export const launchPreorderBundles = launchPreorderProducts.filter(
  (product) => product.type === "bundle"
);
