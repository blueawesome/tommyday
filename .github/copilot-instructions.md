# TommyDay.com — Project Context / Copilot Instructions

## Project overview

This is a personal creative site for Tommy Day.

The site is being built with:

- Astro
- Tailwind CSS
- Alpine.js
- TypeScript
- Cloudflare Pages hosting

This is NOT a corporate web development portfolio. The professional WordPress/developer brand lives separately at WP Indy.

TommyDay.com should feel like a simple, cool, personal artist site focused on:

- analog collage
- music
- occasional video work later
- contact

The main goal for v1 is to showcase collage work beautifully and simply, using structured artwork data that can later support availability, print sales, Etsy links, local shop links, etc.

The site should feel like an artist archive / small handmade catalog / record insert / stamped mailer, not a generic portfolio theme and not an ecommerce storefront.

## Current project state

The Astro project has been created.

Tailwind has been installed with:

```bash
npx astro add tailwind
```

Alpine has been installed with:

```bash
npx astro add alpinejs
```

Tailwind may need to be imported into a shared layout or global stylesheet depending on the generated setup.

The intended first build should stay simple and static.

## High-level site structure

Initial nav should be:

```txt
Collage
Music
Contact
```

Do not add a Shop nav item yet.

Commerce should be present only where appropriate:

* homepage: no big buy buttons
* collage grid: no cluttered buy buttons
* artwork detail page: show available purchase buttons there

The main pages should be:

```txt
/
  Homepage with intro and 2–3 featured collage pieces

/collage/
  Full collage portfolio grid with simple Alpine filters

/collage/[slug]/
  Individual artwork detail page with image, metadata, description, and purchase buttons

/music/
  Simple music placeholder page with links

/contact/
  Simple contact page
```

## Desired visual direction

Keep the site simple, spacious, and art-forward.

The collage work should do most of the visual heavy lifting.

Suggested visual feel:

* warm off-white / paper-like background
* dark near-black text
* simple typography
* restrained use of borders
* generous spacing
* left-side vertical nav on desktop
* horizontal/stacked nav on mobile
* simple art grid, not heavy masonry
* no generic photography-template feel
* no overbuilt ecommerce styling
* no corporate “personal brand” styling

The current logo is not ready yet. Use a text fallback:

```txt
Tommy
Day
```

Later this will be replaced by a hand-lettered logo from a tattoo artist friend, likely used for stamps and site branding.

## Preferred layout

Desktop should use a left sidebar layout:

```txt
[Tommy Day logo/text]

Collage
Music
Contact
```

The main content should sit to the right.

Mobile should stack the logo and nav at the top.

Do not make the sidebar feel like an app/admin sidebar. It should feel like an artist site / archive.

## Recommended file structure

Use this structure unless there is already a better Astro default in place:

```txt
src/
  components/
    ArtCard.astro
    ArtworkPurchaseOptions.astro
    SidebarNav.astro
    SiteShell.astro

  data/
    artworks.ts
    artworkHelpers.ts

  layouts/
    BaseLayout.astro

  pages/
    index.astro
    collage.astro
    music.astro
    contact.astro
    collage/
      [slug].astro

  scripts/
    artFilters.js

public/
  images/
    art/
      placeholders/
        piece-001.jpg
        piece-002.jpg
        piece-003.jpg
```

For v1, use images from `public/images/...` with simple string paths in the artwork data.

Do not set up a CMS yet.

Do not set up ecommerce yet.

Do not add a database.

Do not add React unless absolutely necessary.

## Artwork data model

Create structured artwork data in:

```txt
src/data/artworks.ts
```

Use TypeScript.

Preferred schema:

```ts
export type PurchaseOptionType =
  | "original"
  | "print"
  | "card"
  | "other";

export type PurchaseOption = {
  type: PurchaseOptionType;
  label: string;
  available: boolean;
  price?: string;
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
  alt: string;

  featured?: boolean;
  draft?: boolean;

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
```

Use this data format for sample entries:

```ts
export const artworks: Artwork[] = [
  {
    slug: "godzilla-vs-louis-armstrong",
    catalogId: "TD-001",
    title: "Godzilla vs. Louis Armstrong",
    year: "2026",
    medium: "Analog collage",
    dimensions: "5 × 7 in.",
    image: "/images/art/placeholders/piece-001.jpg",
    alt: "Analog collage featuring Godzilla and Louis Armstrong imagery.",
    featured: true,

    description:
      "Analog collage made from vintage print material. Placeholder description for now.",

    purchaseOptions: [
      {
        type: "original",
        label: "Buy original",
        available: true,
        price: "$125",
        url: "https://etsy.com/",
      },
      {
        type: "print",
        label: "Buy print",
        available: false,
        note: "Prints coming soon.",
      },
    ],

    filters: {
      availability: ["original"],
      subjects: ["music", "monster"],
      themes: ["funny", "surreal", "pop-culture"],
      formats: ["original"],
      sizes: ["5x7"],
    },
  },

  {
    slug: "zooted-001",
    catalogId: "TD-002",
    title: "ZOOTED 001",
    year: "2026",
    medium: "Analog collage",
    dimensions: "4 × 6 in.",
    image: "/images/art/placeholders/piece-002.jpg",
    alt: "Colorful analog collage using vintage animal imagery.",
    featured: true,

    purchaseOptions: [
      {
        type: "original",
        label: "Original sold",
        available: false,
      },
      {
        type: "print",
        label: "Buy print",
        available: true,
        price: "$20",
        url: "https://etsy.com/",
      },
    ],

    filters: {
      availability: ["print"],
      subjects: ["animals"],
      themes: ["psychedelic", "funny"],
      formats: ["print"],
      sizes: ["4x6"],
    },
  },

  {
    slug: "sleep-paralysis-cat-hand",
    catalogId: "TD-003",
    title: "Sleep Paralysis Cat Hand",
    year: "2026",
    medium: "Analog collage",
    dimensions: "4 × 6 in.",
    image: "/images/art/placeholders/piece-003.jpg",
    alt: "Surreal analog collage with a figure, sky, and animal imagery.",
    featured: true,

    purchaseOptions: [
      {
        type: "original",
        label: "Original unavailable",
        available: false,
      },
      {
        type: "print",
        label: "Print unavailable",
        available: false,
      },
    ],

    filters: {
      availability: ["not-for-sale"],
      subjects: ["figure", "animal"],
      themes: ["surreal", "dreamlike"],
      formats: ["original"],
      sizes: ["4x6"],
    },
  },
];

export const publishedArtworks = artworks.filter((artwork) => !artwork.draft);

export const featuredArtworks = publishedArtworks.filter(
  (artwork) => artwork.featured
);
```

## Artwork helper functions

Create:

```txt
src/data/artworkHelpers.ts
```

Use this:

```ts
import type { Artwork } from "./artworks";

export function hasAvailableOriginal(artwork: Artwork) {
  return artwork.purchaseOptions.some(
    (option) => option.type === "original" && option.available
  );
}

export function hasAvailablePrint(artwork: Artwork) {
  return artwork.purchaseOptions.some(
    (option) => option.type === "print" && option.available
  );
}

export function hasAnyPurchaseOption(artwork: Artwork) {
  return artwork.purchaseOptions.some((option) => option.available);
}

export function getAvailabilityLabel(artwork: Artwork) {
  const original = hasAvailableOriginal(artwork);
  const print = hasAvailablePrint(artwork);

  if (original && print) return "Original + prints available";
  if (original) return "Original available";
  if (print) return "Prints available";

  return "Not currently available";
}
```

Do not duplicate this logic in multiple components.

## Components to create

### `BaseLayout.astro`

Should define the HTML document, page title, description, viewport, and body styling.

Basic body styling:

```txt
bg-stone-100 text-neutral-950 antialiased
```

If Tailwind styles are not working, check that the global Tailwind stylesheet is imported in the layout according to the Astro/Tailwind integration output.

### `SidebarNav.astro`

Temporary text logo:

```txt
Tommy
Day
```

Links:

```txt
Collage
Music
Contact
```

Use a vertical nav on desktop and a compact horizontal nav on mobile.

### `SiteShell.astro`

Wrap all pages in the layout and provide the left sidebar.

Suggested desktop grid:

```txt
md:grid-cols-[220px_1fr]
```

Sidebar can be sticky on desktop.

### `ArtCard.astro`

Used on homepage and collage grid.

Should show:

* image
* catalog ID
* title
* medium
* dimensions
* optional availability label

Should link to:

```txt
/collage/[slug]/
```

Should not show buy buttons.

Use `loading="lazy"` for images.

### `ArtworkPurchaseOptions.astro`

Used only on individual artwork detail pages.

Should filter:

```ts
artwork.purchaseOptions.filter((option) => option.available && option.url)
```

Render buttons for available purchase options.

If nothing is available, show:

```txt
This piece is not currently available.
```

## Alpine filtering

Use Alpine only on the `/collage/` page for simple filtering.

Create:

```txt
src/scripts/artFilters.js
```

With this logic:

```js
document.addEventListener("alpine:init", () => {
  Alpine.data("artFilters", () => ({
    filter: "all",

    setFilter(filter) {
      this.filter = filter;
    },

    matches(el) {
      if (this.filter === "all") return true;
      if (this.filter === "originals") return el.dataset.original === "true";
      if (this.filter === "prints") return el.dataset.print === "true";
      if (this.filter === "sold") return el.dataset.sold === "true";
      if (this.filter === "not-for-sale") {
        return el.dataset.notForSale === "true";
      }

      return true;
    },
  }));
});
```

Initial filters should be:

```txt
All
Originals available
Prints available
Sold
```

Do not overbuild filters yet.

Later possible filters:

* subject matter
* size
* theme
* color
* year
* format

But v1 should only include availability filters.

## Page requirements

### Homepage `/`

Purpose:

* introduce the site
* show 2–3 featured collage pieces
* link to full collage page
* small music/contact sections

Suggested headline:

```txt
Art, music, and small-batch oddities.
```

Suggested intro:

```txt
Analog collage, songs, videos, and handmade work by Tommy Day.
```

Homepage should use:

```ts
featuredArtworks.slice(0, 3)
```

Do not show big buy buttons on homepage.

### Collage page `/collage/`

Purpose:

* show all published artworks
* include simple Alpine filters
* each card links to detail page

Suggested intro:

```txt
Analog collage made from old magazines, books, ads, packaging, and whatever else survives the scissors.
```

Use simple responsive CSS/Tailwind grid:

```txt
sm:grid-cols-2 lg:grid-cols-3
```

No masonry library.

No complicated lightbox in v1.

### Artwork detail page `/collage/[slug]/`

Use Astro `getStaticPaths()` from `publishedArtworks`.

Page should show:

* large image
* catalog ID
* title
* medium
* dimensions
* year
* availability label
* description if present
* purchase options component
* back link to collage

This is the only place where buy buttons should be prominent.

### Music page `/music/`

Simple placeholder for now.

Text:

```txt
Songs, videos, live sets, and recordings. More here soon.
```

Add placeholder buttons/links for:

```txt
Spotify
YouTube
Bandcamp
```

Use `#` URLs for now if real URLs are not known.

### Contact page `/contact/`

Simple.

Use:

```txt
hey@tommyday.com
```

Text:

```txt
For art, music, booking, commissions, or weird opportunities:
```

## Coding style preferences

Keep things simple.

Do not introduce unnecessary dependencies.

Avoid clever abstractions unless they clearly reduce repeated code.

Prefer Astro components over React.

Use Alpine only for small interactive behavior.

Use plain TypeScript data for now.

Avoid building a CMS or admin system.

Avoid heavy animation libraries.

Avoid generic portfolio template patterns.

Do not make the site feel like a store.

Do not make the site feel like a developer portfolio.

## Important design/business decisions

* No Shop nav item yet.
* Buy buttons belong on artwork detail pages.
* Homepage and grid should feel like an art archive first.
* Structured data should support both original and print availability.
* Some works may have original available, prints available, both, neither, sold, or not-for-sale.
* The site must be easy to update when final scans/images arrive.
* Placeholder photos are acceptable for v1.
* The final hand-lettered logo is not ready yet; use text fallback.
* Headshot/photos are not ready yet; do not block build on them.

## Deployment target

The site will be deployed on Cloudflare Pages.

Expected settings:

```txt
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Node version: 20 or 22
```

Before domain swap:

```bash
npm run build
npm run preview
```

Then deploy to the Cloudflare Pages temporary URL first.

Only point TommyDay.com after checking:

* homepage
* collage page
* artwork detail pages
* mobile layout
* nav links
* image paths
* build output

# TommyDay.com — Copilot Image Handling Update

## Goal

Keep artwork image handling simple for v1.

Use one public artwork folder for placeholder phone photos:

public/art/placeholders/

Do not create extra folders like:

public/images/art/originals
public/images/art/scans
public/images/art/thumbs

The current goal is to drop phone photos into:

public/art/placeholders/

and reference them directly from the artwork data.

Astro serves files in public/ from the site root, so this file:

public/art/placeholders/godzilla-vs-louis-armstrong.jpg

is referenced in code as:

image: "/art/placeholders/godzilla-vs-louis-armstrong.jpg"

---

## Image naming rules

Do not use raw phone filenames like:

IMG_4938.jpeg
IMG_4939.jpeg

Rename artwork photos to match the artwork slug.

Good:

godzilla-vs-louis-armstrong.jpg
zooted-001.jpg
sleep-paralysis-cat-hand.jpg

Bad:

IMG_4938.jpeg
final-final-art-photo-new.jpeg
collage pic 1.jpg

Use lowercase, hyphenated filenames.

---

## Artwork schema image fields

Update the artwork schema to support a main image and an optional thumbnail.

For v1, the thumbnail can usually be omitted.

Use these fields:

image: string;
thumbnail?: string;
alt: string;
imageAspect?: "portrait" | "landscape" | "square" | "free";

The updated relevant part of the Artwork type should be:

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

Example artwork entry:

{
slug: "godzilla-vs-louis-armstrong",
catalogId: "TD-001",
title: "Godzilla vs. Louis Armstrong",
year: "2026",
medium: "Analog collage",
dimensions: "5 × 7 in.",
image: "/art/placeholders/godzilla-vs-louis-armstrong.jpg",
alt: "Analog collage featuring Godzilla and Louis Armstrong imagery.",
imageAspect: "portrait",
featured: true,

description:
"Analog collage made from vintage print material. Placeholder description for now.",

purchaseOptions: [
{
type: "original",
label: "Buy original",
available: true,
price: "$125",
url: "https://etsy.com/",
},
{
type: "print",
label: "Buy print",
available: false,
note: "Prints coming soon.",
},
],

filters: {
availability: ["original"],
subjects: ["music", "monster"],
themes: ["funny", "surreal", "pop-culture"],
formats: ["original"],
sizes: ["5x7"],
},
}

---

## ArtCard image display

Do not hard-crop artwork cards with object-cover and a forced aspect ratio for now.

The collage pieces will have different proportions, and v1 should let the full artwork show.

In ArtCard.astro, use this approach:

---

## const cardImage = artwork.thumbnail || artwork.image;

<div class="bg-white p-2 shadow-sm">
  <img
    src={cardImage}
    alt={artwork.alt}
    loading="lazy"
    class="h-auto w-full"
  />
</div>

Avoid this for now:

<img
src={artwork.image}
alt={artwork.alt}
loading="lazy"
class="aspect-[4/5] w-full object-cover"
/>

That crops too aggressively and can make the collage work feel boxed into a generic portfolio template.

---

## Detail page image display

On individual artwork pages, use the main image:

<img
src={artwork.image}
alt={artwork.alt}
class="w-full bg-white shadow-sm"
/>

No lazy loading is necessary for the main image on the detail page unless it is below the fold.

---

## Phone photo prep

For placeholder photos, resize large phone images before committing them.

Target:

JPG
long edge around 1800–2400px
reasonable quality, around 75–85%
sRGB if available

A good default is:

2000px on the long edge

This is enough for a temporary web image and keeps the repo from getting bloated.

On Mac, a quick terminal option is:

sips -Z 2000 path/to/source-images/*.jpg --out public/art/placeholders

If the files are .jpeg, either update the command or rename/export as .jpg.

---

## Current immediate task

Update the current broken placeholder image paths.

If the artwork data currently uses:

image: "/images/art/placeholders/piece-001.jpg"

change it to:

image: "/art/placeholders/godzilla-vs-louis-armstrong.jpg"

Then make sure this file actually exists:

public/art/placeholders/godzilla-vs-louis-armstrong.jpg

Repeat for each artwork.

---

## Important constraints

Keep this simple.

Do not add Astro Image optimization yet.
Do not move images into src/assets yet.
Do not add a CMS.
Do not add a lightbox yet.
Do not add masonry yet.
Do not create multiple image folders yet.

For v1, use:

public/art/placeholders/

with clean slug-based filenames and plain img tags.

Later, final scans can replace these files directly or the project can migrate to Astro’s optimized image workflow. That should not block the current build.
