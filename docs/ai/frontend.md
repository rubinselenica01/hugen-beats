# Frontend — react-producer

## Framework composition

- **`main.jsx`:** `StrictMode`, sets **`document.title`** using `producerBrand`, mounts **`App`** into `#root`.
- **`App.jsx`:** `BrowserRouter`, global **`ScrollToTop`**, **`CartProvider`**, route table, **`BeatPreviewPlayerBar`** outside `Routes` so it persists across pages.

## Routing (`constants/routes.js`)

| Path | Page | Guard |
|------|------|-------|
| `/` | `HomePage` | — |
| `/beats` | `BeatsCatalogPage` | — |
| `/contact` | `ContactPage` | — |
| `/admin/login` | `LoginPage` | — |
| `/admin/beat-management` | `AdminBeatManagementPage` | **`RequireAdminSession`** |
| `*` | `NotFoundPage` | — |

**Note:** Login route path **`/admin/login`** — marketing/admin UX split under `/admin` prefix except catalog lives at **`/beats`** (not `/admin/...`).

## Layout & marketing

- **`TopNav` / `Footer`:** Wired from **`homeContent.js`** (`navLinks`, `footer`, etc.).
- **`HeroSection`**, **`FeaturedBeatsSection`**, editorial sections compose **`HomePage`**.
- Hash navigation + **`IntersectionObserver`** clears `#` when hero visible (`HomePage.jsx`).

## Beat merchandising UI

- **`BeatCard`:** Compact grid cards; preview play integrates **`useBeatPreviewToggle`** + global session.
- **`LicenseModal`:** Opens from catalog/home when selecting license; feeds **`useCart`** (`addToCart`).
- **`FeaturedBeatsSection`:** Shows **`catalogBeats.slice(0, 4)`** on home.

## Admin UI

- **`AdminBeatManagementPage`:** Lists **`GET /beats`** results in responsive grid / horizontal scroll mobile layout.
- **`AddBeatDialog`:** Portal modal; create uses native **`FormData(form)`**; edit builds **`FormData`** manually for partial files + checkbox `isHidden` as `'true'`/`'false'` strings.
- **`DeleteBeatConfirmDialog`:** DELETE `/beats/:id`, stops preview playback for deleted id.

## Global preview player

- **`BeatPreviewPlayerBar`:** Subscribes to beat preview session; **`WaveSurfer`** visualizes waveform tied to hidden `<audio>`.

## Styling

- **Tailwind** extended palette (`primary`, `background-dark`, `surface`, … — `tailwind.config.js`).
- **`index.css`:** Global/base styles (referenced in `main.jsx`).
- Dark shell via **`<html class="dark">`**.

## Context

- **`CartContext`:** Cart lines, drawer open state, persistence, catalog-driven prune + mutation subscription.

## Hooks (examples)

| Hook | Role |
|------|------|
| `useCatalogBeats` | Initial public catalog load |
| `useBeatPreviewPlayback` | Playing state + toggle handler |
| `useBodyScrollLock` | Modal/drawer scroll lock |
| `useScrollToTop` | Route change scroll reset |

## Assets

- Logo/components under **`components/brand/`**; public images referenced from **`homeContent.js`** paths.

## Checkout UX gap

`CartDrawer` **`Checkout`** **`ButtonPrimary`** has **no `onClick`** — intentional stub pending payment integration.
