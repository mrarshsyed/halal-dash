# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Halal admin dashboard (package name `dev-script-frontend`): a Vue 3 + Vuetify 3 + Pinia + Vue Router SPA built with Vite, with Tailwind CSS alongside Vuetify. It manages hotels, activities, cruises, holidays, restaurants, transfers, insurance, promos, blogs, sliders, orders and settings via a backend REST API. JavaScript only (no TypeScript); no test suite is configured.

## Commands

Uses yarn (`yarn.lock`).

- `yarn dev` — Vite dev server on port 3000
- `yarn build` — production build to `dist/`
- `yarn preview` — serve the built bundle
- `yarn lint` — ESLint with `--fix`

Requires a `.env` with `VUE_APP_API_BASE_URL` (see `.env.example`). `vite.config.js` loads it via dotenv and exposes all of `process.env` to client code (`define: { 'process.env': process.env }`), so env vars are read as `process.env.VUE_APP_*`, not `import.meta.env`. `@` aliases `src/`. Netlify deploys with an SPA fallback redirect (`netlify.toml`).

## Architecture

- **`src/config/userRoutes.js`** is the central config and is very large. It exports:
  - `permissions` — permission-string constants (e.g. `'hotel-list'`)
  - `routes` — all vue-router routes; `meta: { requiresAuth, role, permissions }` drives authorization
  - `navLinks` — sidebar menu definitions, also gated by permissions
  - `userCreatePermissions` / `managerCreatePermissions` — permission trees used when creating users/managers

  Adding a page usually means: create a view in `src/views/<feature>/`, add a permission constant, a route entry, and a nav link, all in this file.
- **`src/router/index.js`**: `beforeEach` guard for `requiresAuth` routes. It re-fetches user info each navigation, checks `meta.role`, lets `super-admin` through everything, otherwise requires at least one of `meta.permissions` to be in the user's permissions. Failures redirect to `pageNotFound`.
- **`src/store/app.js`** (Pinia `app` store): global loading flag, snackbar, dialog, user/tokens persisted in `localStorage` (`user`, `tokens`, `authToken`, `navLinks`), plus shared state such as hotel/rating details.
- **`src/plugins/axios.js`**: global axios setup — base URL from env, credentials enabled, Bearer token injected from the store, loading toggled on every request/response, error messages auto-shown in the snackbar, and a refreshed token taken from the `x-new-access-token` response header. Import axios from `@/plugins/axios` (not `axios`) so these interceptors apply.
- **`src/views/`** is organized per feature (hotels, activity, cruise, holiday, restaurant, ...). **`src/components/`** holds shared building blocks: generic `CRUD.vue` (data table + dialog), `FormComponent.vue`/`DialogComponent.vue` (dynamic form fields driven by store `formComponents`), TipTap-based `HtmlEditor.vue`/`DocumentEditor.vue`, and `Order/`.
- `src/plugins/index.js` registers Vuetify/router/pinia on the app; Vuetify components are auto-imported by `vite-plugin-vuetify`.

## Gotchas

- `getAuthToken()` in `src/store/app.js` appears to call `localStorage.getItem('authToken')` without returning it, so the axios interceptor may never attach the Bearer header. Check this before debugging auth issues.
- `dist/` and `package/` are present in the repo root; they are not source.
