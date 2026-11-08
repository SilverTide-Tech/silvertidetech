# silvertidetech
Official website of our technology company and its products

## Development

Requires Node.js 22.23.4 or newer.

```sh
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:4321
npm run check    # type-check Astro and TypeScript files
npm run build    # production build to ./dist
npm test         # unit, content-rule and SEO tests against the build (run after `npm run build`)
npm run audit    # accessibility (axe, WCAG 2.2 AA) + responsive audit of every page at 390/768/1024/1440 px
npm run assets   # regenerate logo, icons and social image from the official masters in ./brand-source
```

`npm run audit` starts its own preview server. Astro allows one preview server at a time, so stop any other
`astro preview` first, or point the audit at a running server with `BASE_URL=http://127.0.0.1:4321 npm run audit`.
Set `CHROME_PATH` if Chrome is not installed in a standard location.

### Production domain

Set `SITE_URL` when building for production, for example `SITE_URL=https://www.example.com npm run build`.
Canonical URLs, `sitemap.xml`, the sitemap line in `robots.txt`, absolute Open Graph image URLs and
breadcrumb structured data are generated only when it is set.

