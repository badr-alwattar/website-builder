# Rekaz Website Builder

A mini visual website builder built with **Next.js 16**, **TypeScript**, and **React 19**. Click pre-made sections onto a canvas, edit their properties, reorder with drag-and-drop, and export or import your layout as JSON. Publish finished pages to a shareable URL.

**Live demo:** _https://rekaz-website-builder-beta.vercel.app_

## Requirements coverage

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Section library (click-to-add) | ✅ | `SectionLibraryPanel` — 9 section types from `lib/section-registry.ts` |
| Live preview area | ✅ | Real-time canvas + full-screen `PreviewModal` with device widths |
| Import / export JSON | ✅ | `lib/export-import.ts` + toolbar buttons + `Ctrl/Cmd+E` export |
| Editable section properties | ✅ | `SectionEditPanel` with per-type forms (react-hook-form) |
| Delete sections | ✅ | Canvas toolbar, double-click confirm, `Delete` / `Backspace` |
| Drag-and-drop reorder | ✅ | `@dnd-kit` in `BuilderCanvas` / `SortableSectionCard` |
| Fully responsive builder | ✅ | Desktop 3-panel layout; mobile slide-in drawers |
| Performance / minimal re-renders | ✅ | Selective Zustand subscriptions, per-section cards, debounced sync |
| Subtle animations (bonus) | ✅ | Framer Motion on drawers, add/remove, drag, modals |
| SSR-friendly | ✅ | Server Components for landing, builder entry, published pages |
| Next.js + TypeScript | ✅ | App Router, strict typing throughout |

## Features

### Core builder (coding task requirements)

- **Section library (click-to-add)** — 9 pre-made sections (Header, Hero, Features, Testimonials, CTA, Gallery, Pricing, FAQ, Footer). Click any card in the left panel to add it to the page.
- **Live preview** — The canvas renders real section components as you build. A full-screen preview modal supports mobile (375px), tablet (768px), and desktop viewports.
- **Import / export** — Save and restore page layouts as JSON files from the toolbar (desktop) or with keyboard shortcuts.
- **Editable sections** — Select a section to edit title, copy, image URLs, colors, and more in the properties panel. Delete sections from the canvas or with `Delete` / `Backspace`.
- **Drag-and-drop reorder** — Reorder sections on the canvas using the grip handle (`@dnd-kit`).

### Additional capabilities

- **Undo / redo** — 50-step history (`Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z`).
- **Autosave** — Drafts persist to PostgreSQL (2s debounce) with a localStorage backup (500ms) for crash recovery.
- **User accounts** — Register, log in, and manage drafts per user.
- **Publish** — Publish a draft to a public URL at `/p/[slug]`, server-rendered for SEO.
- **Responsive builder UI** — Desktop three-panel layout; mobile slide-in drawers for sections and editing.
- **Responsive sections** — Section templates use CSS container queries so they adapt inside the preview frame, not just the browser window.
- **Animations** — Framer Motion transitions for drawers, section add/remove, drag feedback, and modals.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, standalone output) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| State | Zustand |
| Forms | react-hook-form + Zod |
| Drag & drop | @dnd-kit |
| Animation | Framer Motion |
| Database | PostgreSQL 16 + Prisma 7 |
| Auth | JWT (HTTP-only cookies) + bcrypt |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/) v2+
- No local Node.js install required for the Docker workflow below

## Local installation (Docker)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd website-builder
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set a strong `JWT_SECRET`:

```env
POSTGRES_USER=rekaz
POSTGRES_PASSWORD=rekaz
POSTGRES_DB=rekaz

DATABASE_URL="postgresql://rekaz:rekaz@db:5432/rekaz"
JWT_SECRET="replace-with-a-long-random-string"
```

> **Note:** `DATABASE_URL` uses host `db` because that is the PostgreSQL service name in Docker Compose.

### 3. Start the application

```bash
docker compose up --build
```

On first run, the app container will:

1. Build the Next.js standalone image (multi-stage Dockerfile)
2. Wait for PostgreSQL to become healthy
3. Run `prisma migrate deploy`
4. Start the server on port **3000**

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Stop the stack

```bash
docker compose down
```

To remove the database volume as well:

```bash
docker compose down -v
```

## Local development (without Docker)

If you prefer running Next.js on your host machine:

```bash
npm install
cp .env.example .env
```

Point `DATABASE_URL` at a local Postgres instance (use `@localhost` instead of `@db`), then:

```bash
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 3000 already in use | Stop the other process or change the port mapping in `docker-compose.yml` (e.g. `"3001:3000"`) |
| Database connection refused | Wait for the `db` healthcheck to pass, or run `docker compose logs db` |
| Migrations fail on first boot | Run `docker compose down -v` then `docker compose up --build` for a clean database |
| Changes not reflected after rebuild | Run `docker compose up --build` (not just `up`) after code changes |

## Deployment

The app is configured for **standalone** output (`next.config.ts`) and ships with a multi-stage **Dockerfile** for self-hosting.

**Vercel (recommended for Next.js):**

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com).
2. Add environment variables: `DATABASE_URL`, `JWT_SECRET` (use a hosted Postgres provider such as Neon or Supabase).
3. Run migrations against the production database: `npx prisma migrate deploy`.
4. Deploy — Vercel runs `npm run build` automatically.

**Docker (self-hosted):**

```bash
docker compose up --build -d
```

Ensure `.env` is configured on the host and port 3000 (or your mapped port) is reachable.

## Usage

1. **Register or log in** from the landing page.
2. Open the **builder** at `/builder`.
3. **Add sections** from the left panel.
4. **Click a section** on the canvas to edit its properties in the right panel.
5. **Drag** the grip handle to reorder sections.
6. **Export** your layout as JSON, or **import** a previously saved file.
7. **Preview** the page in a full-screen modal with device width toggles.
8. **Publish** to get a public link at `/p/your-slug`.

### Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + E` | Export JSON |
| `Ctrl/Cmd + P` | Toggle preview |
| `Delete` / `Backspace` | Delete selected section |
| `Escape` | Deselect section / close preview |

## Project structure

```
app/
  builder/          # Builder page (SSR → client shell)
  p/[slug]/         # Published sites (fully SSR)
  api/              # Auth + site CRUD + publish endpoints
components/
  builder/          # Canvas, library, toolbar, edit panel, preview
  sections/         # 9 reusable section templates
  landing/          # Marketing homepage
store/              # Zustand stores (builder state, UI state)
lib/                # Export/import, section registry, autosave, auth
types/              # PageConfig and section prop types
prisma/             # Database schema and migrations
```

## Architecture highlights

- **SSR-first** — Landing page, builder entry, and published sites are Server Components. Interactive builder logic lives in a single client island (`BuilderShell`).
- **Section registry** — One map (`lib/section-registry.ts`) connects section types to components, used by the canvas, preview modal, and published pages.
- **JSON as source of truth** — `PageConfig` is stored in PostgreSQL and round-trips through import/export unchanged.
- **Performance** — Selective Zustand subscriptions, per-section canvas cards, debounced edit-panel → store sync, `React.memo` + `useMemo`, debounced autosave, and `next/dynamic` for heavy modals.

## Data model

The builder stores everything as a versioned `PageConfig` JSON document:

```json
{
  "version": "1.0",
  "id": "abc123",
  "name": "My Landing Page",
  "createdAt": "2026-05-23T12:00:00.000Z",
  "updatedAt": "2026-05-23T12:05:00.000Z",
  "sections": [
    {
      "id": "sec1",
      "type": "hero",
      "order": 0,
      "props": { "title": "Welcome", "subtitle": "..." }
    }
  ]
}
```

This same shape is used for canvas state, PostgreSQL persistence, import/export files, and published pages.
