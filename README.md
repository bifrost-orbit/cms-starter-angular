# CMS Orbit starter for Angular

An Angular website, rendered on the server with `@angular/ssr` and Express, that reads its pages from [CMS Orbit](https://bifrostorbit.com/products/cms-orbit/), the headless CMS in Bifröst Orbit. It is the finished project from the [Angular quickstart](https://docs.bifrostorbit.com/cms/developers/quickstart-angular/): every published page at its own address, your own Angular components for the blocks editors place, drafts in the live preview, and a signed webhook that clears cached pages when editors publish.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/bifrost-orbit/cms-starter-angular?quickstart=1)

## Set up

1. **Create your copy.** Select **Use this template** on GitHub, or run `gh repo create my-website --template bifrost-orbit/cms-starter-angular --private --clone`.
2. **Add your settings.** Copy `.env.example` to `.env` and fill in the API address, keys and region from **Configuration › API keys** and **Configuration › Environments** in CMS Orbit.
3. **Run it.** Run `npm install`, then `npm start`, and open `http://localhost:4200`.

## What's inside

| File | What it does |
| --- | --- |
| `src/cms.server.ts` | The CMS Orbit client and the page cache, on the server only |
| `src/server.ts` | The Express server: every page, the preview routes and the signed webhook at `/api/cms-webhook` |
| `src/app/cms/cms-page.ts` | Draws a page, with its title, description and not found |
| `src/app/blocks/` | The components, `hero`, `action`, `featureGrid` and `featureItem`, and the registry that picks one for each block |

## Make it yours

- Draw your components in `src/app/blocks/` and register them in `src/app/blocks/registry.ts`, using the component keys from your own space. Run `npm run cms:types` to write types for your space's components to `src/app/cms/types.ts`.
- Angular's server only renders for host names it knows. Add your website's to `security.allowedHosts` in `angular.json`, or set `NG_ALLOWED_HOSTS` where it runs.
- For the live preview, set **Preview URL** in the space's **Settings**. For refresh on publish, add a webhook to `https://your-website/api/cms-webhook` and put its secret in `CMS_WEBHOOK_SECRET`. The [quickstart](https://docs.bifrostorbit.com/cms/developers/quickstart-angular/) explains both.
- To run it in production, run `npm run build`, then `npm run serve:ssr`. It listens on `PORT` (4000 by default).

Needs Node.js 22.9 or later and `@bifrost-orbit-cms/sdk` 0.12.

## Licence

MIT. See [LICENSE](LICENSE).
