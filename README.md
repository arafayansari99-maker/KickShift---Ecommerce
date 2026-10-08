# KICKSHIFT Storefront

KICKSHIFT is a responsive footwear storefront concept for discovering performance and everyday sneakers, saving favorites, and designing a personalized shoe colorway.

## Storefront features

- **Editorial home page** with animated product features and curated product carousels.
- **Nine-shoe catalog** across Running, Court, and Everyday collections, with text search, category filters, and price/rating sorting.
- **Product detail pages** with product stories, ratings, image-angle galleries, size selection, and customer reviews.
- **Shoe customization studio** with a live shoe preview, color choices for the upper, sole, laces, and accents, plus optional initials.
- **Wishlist and shopping bag** with quantity controls and custom configurations.
- **Checkout experience** for previewing the shopping flow.
- Cart, wishlist, and locally submitted reviews are stored in the browser using `localStorage`.
- Responsive layouts, keyboard-friendly controls, motion effects, and accessible labels throughout the storefront.

> **Prototype note:** The storefront uses a local sample catalog and browser storage. Checkout is a front-end experience; this repository does not currently process payments, place server-side orders, or manage live inventory.

## Tech stack

- React 19, TypeScript, and Vite
- Tailwind CSS 4, with Radix UI components
- Framer Motion for interface animation
- Wouter for client-side routing
- pnpm workspaces

## Run locally

Use Node.js 24 and pnpm. From the repository root, install dependencies:

```sh
pnpm install
```

On Windows, run the install command from Git Bash because the workspace preinstall script uses `sh`. Once installation is complete, the dev server can be started from PowerShell or Git Bash.

The storefront Vite configuration requires `PORT` and `BASE_PATH`. For PowerShell:

```powershell
$env:PORT = "25941"
$env:BASE_PATH = "/"
pnpm --filter @workspace/kickshift-storefront run dev
```

For Bash:

```sh
PORT=25941 BASE_PATH=/ pnpm --filter @workspace/kickshift-storefront run dev
```

Open [http://localhost:25941](http://localhost:25941).

## Build and checks

```sh
# Type-check libraries and workspace artifacts
pnpm run typecheck

# Type-check and build all workspace packages
pnpm run build

# Build only the storefront
pnpm --filter @workspace/kickshift-storefront run build
```

The storefront static build is written to `artifacts/kickshift-storefront/dist/public`.

## Repository layout

| Path | Purpose |
| --- | --- |
| `artifacts/kickshift-storefront/` | Main customer-facing React/Vite storefront |
| `artifacts/api-server/` | Express API service workspace |
| `artifacts/mockup-sandbox/` | Separate mockup and UI exploration app |
| `lib/api-spec/` | OpenAPI definition and generated API client/schema tooling |
| `lib/api-client-react/` | Shared React API client |
| `lib/api-zod/` | Shared API validation schemas |
| `lib/db/` | PostgreSQL schema and Drizzle ORM tooling |
| `docs/` | Project case-study materials |

The storefront source and routes are under `artifacts/kickshift-storefront/src/`. Product content is currently defined in the storefront application; cart, wishlist, and reviews are local to each browser.

## Optional API and database workspaces

The workspace also includes an Express API service and PostgreSQL/Drizzle database package. They are separate from the storefront's current local sample-data flow. The API requires a `DATABASE_URL` PostgreSQL connection string; configure it before starting the API or applying database schema changes.

```sh
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/db run push
```

`push` updates the development database schema. Do not use it against a production database without reviewing the migration impact.
