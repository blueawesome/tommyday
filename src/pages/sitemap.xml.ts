import { publishedArtworks } from "../data/artworks";
import { greetingCards } from "../data/cards";
import { cardPacks } from "../data/cardPacks";
import { coreOccasionSlugs } from "../data/cardTaxonomies";

const site = "https://tommyday.com";

const staticRoutes = [
  "/",
  "/collage/",
  "/originals/",
  "/prints/",
  "/shop/",
  "/cards/",
  "/cards/build-a-pack/",
  "/cards/packs/",
  ...coreOccasionSlugs.map((slug) => `/cards/${slug}/`),
  "/about/",
  "/contact/",
  "/shipping/",
  "/privacy/",
  "/terms/",
];

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const sitemapArtworks = publishedArtworks.filter(
    (artwork) => artwork.showInGallery !== false || artwork.showInShop !== false
  );
  const urls = [
    ...staticRoutes,
    ...sitemapArtworks.map((artwork) => `/collage/${artwork.slug}/`),
    ...greetingCards
      .filter((card) => card.status !== "draft" && card.status !== "retired")
      .map((card) => `/cards/${card.slug}/`),
    ...cardPacks
      .filter((pack) => pack.type !== "build-your-own")
      .map((pack) => `/cards/packs/${pack.slug}/`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (route) => `  <url>
    <loc>${xmlEscape(new URL(route, site).href)}</loc>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
