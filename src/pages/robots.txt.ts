const site = "https://tommyday.com";

export function GET() {
  return new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /music/",
      "Disallow: /video/",
      "Disallow: /blog/",
      "",
      `Sitemap: ${site}/sitemap.xml`,
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
