# tommyday.com

Personal Astro site for Tommy Day. This is the home base for collage, music, video, blog posts, and contact, with the collage section acting as a filterable portfolio and sales hub.

## Stack

- Astro 6
- Tailwind CSS 4 through Vite
- Alpine.js for lightweight filtering and page behavior

## Project shape

- `src/pages/`: route files for home, collage, music, video, blog, and contact
- `src/pages/collage/[slug].astro`: static detail pages for individual artworks
- `src/pages/blog/[slug].astro`: static blog post pages powered by Astro content collections
- `src/data/artworks.ts`: typed artwork catalog, including sale options and filter metadata
- `src/data/siteContent.ts`: typed content for the Music and Video sections
- `src/components/`: cards, layout shell, sidebar nav, media embeds, purchase options, and shared page headers
- `src/content/`: markdown blog posts
- `src/scripts/`: Alpine filter logic and PJAX behavior
- `public/art/`: artwork images and placeholders

## Commands

- `npm run dev`: start the Astro dev server
- `npm run build`: create the production build in `dist/`
- `npm run preview`: serve the built site locally

## Notes

- Artwork availability is driven by `purchaseOptions` plus the top-level `status` field.
- The collage filter UI is sentence-based and only exposes medium-specific filtering when the user is browsing work for sale.
- Music and Video content are data-driven so real links and embeds can be swapped in without changing page structure.
- The blog is intentionally lightweight: markdown posts, flat archive, no CMS, no pagination.
