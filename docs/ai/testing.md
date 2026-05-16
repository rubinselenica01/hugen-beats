# Testing — react-producer

## Current state

`package.json` defines **`dev`**, **`build`**, **`preview`** only — **no Jest, Vitest, Cypress, or Playwright** dependencies or scripts were found.

## Suggested stack

- **Vitest** + **@testing-library/react** for components/hooks.
- **MSW** (Mock Service Worker) to simulate `/catalog/beats`, `/admin/me`, multipart `/beats`.

## Unit targets (high value)

- `apiUrl` — trailing slash stripping, empty base.
- `parseFastApiErrorDetail` — string vs array shapes.
- `validateContactForm` — boundary lengths / email regex.
- `cartLineKey` / prune logic — extracted pure helpers if testing CartContext in isolation.

## Integration / E2E

- Playwright/Cypress: login flow, admin gate redirect, `AddBeatDialog` validation (requires API or MSW).

## Mocking strategy

- Mock `fetch` globally or per test file; verify **`credentials`** flag differs between `adminFetch` and `fetchCatalogBeats`.

## Coverage expectations

Undefined — establish when introducing Vitest.
