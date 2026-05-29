import { publishedArtworks } from "../data/artworks";

const site = "https://tommyday.com";

const staticRoutes = [
  "/",
  "/collage/",
  "/pre-order/",
  "/shop/",
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
  const urls = [
    ...staticRoutes,
    ...publishedArtworks.map((artwork) => `/collage/${artwork.slug}/`),
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
