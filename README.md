# LanXgrow public website

Production website: https://www.lanxgrow.com/ (`lanxgrow.com` redirects here).

## Find the right source

| Work | Source | Published path |
| --- | --- | --- |
| Homepage copy, sections and introductory interview | `website/pages/home.html` | `/` |
| Interview Prep marketing page | `website/pages/interview-prep.html` | `/interview-prep` |
| Shared website support styles | `website/assets/site-support.css` | `/site-support.css` |
| Shared website support interactions | `website/assets/site-support.js` | `/site-support.js` |
| Logos, images, icons and archived public policies | `public/` | Existing public URLs |
| Website assembly | `scripts/build-homepage.mjs` | Copies website sources after Vite builds |
| Offline cache generation | `scripts/build-pwa.mjs` | `/service-worker.js` |
| Hosting routes, redirects and headers | `vercel.json` | Hosting configuration |

`website/` contains the static public marketing website. Page-specific styles and
scripts remain inside the existing HTML files; do not merge the two pages or
extract their code as part of a folder-only change.

The `src/` React tree is a separate application/compatibility layer. Its Vite
entry becomes `dist/app.html`; hosting routes and redirects decide which URLs
reach it. In particular, `src/pages/Home.tsx` is **not** the source of the current
production `/` page. `src/pages/InterviewPrep.tsx` is not the static public
`/interview-prep` source either. Do not reorganize app, admin, AI, review or
pending work while editing only the website.

## Build and check

```sh
npm ci --ignore-scripts
npm run build
node scripts/test-introduction-completion.mjs
node scripts/test-pwa.mjs
```

`npm run build` runs TypeScript, Vite, website assembly, then PWA generation.
Deploy the completed `dist/` output, not the `website/` source directory or the
service-worker template. Build from the repository root. Vite's development
server and `npm run preview` do not reproduce all Vercel rewrites and redirects;
check the built `index.html` and `interview-prep.html` for the public website.

## Source and release boundaries

- Domain linkage verified on 12 November 2026: Vercel project
  `lanxgrow-learner-review` (`prj_Spcle09rE6KAA5NXWlxYciLMNrEm`) serves the public
  custom domain despite its historical project name.
- The organization baseline is deployed commit
  `152cafef434c2a4db94a0aa59c78fb6d7670499c`. Recheck the domain's deployment
  before future edits; do not assume repository `main` or the newest preview is
  the current website.
- `lanxgrow2-0website.vercel.app` is a different deployment. Do not apply its
  older source structure to the custom-domain website.
- Preserve existing public URLs, page wording, section order, CSS order and
  behavior. `dist/founder-homepage.html` is retained for output compatibility;
  `vercel.json` continues redirecting its public URL to `/`.
- `docs/` contains setup notes and historical decisions. Dates and claims in
  earlier audits are historical evidence, not current deployment verification.
- Preserve duplicate assets and dormant source until their ownership and use
  are confirmed. Do not consolidate SQL or apply database changes during
  website organization.
- Keep pending candidates and other workstreams separate. Do not import
  features, change auth/roles/storage keys, or restore learner trial-day UI as
  part of this cleanup.
- Source organization does not authorize merging or deploying to production.
  Keep changes on an isolated branch for review.
