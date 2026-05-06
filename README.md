# Help Study Abroad - Frontend Assessment

Admin dashboard application built for a frontend internship assessment.

## Live Demo
- Vercel URL: pending deployment update

## Features
- Login with DummyJSON credentials and token persistence
- Protected routes with redirect to login for unauthenticated users
- Dashboard summary cards for users, products, and categories
- Users module with search, pagination, and profile detail pages
- Products module with search, category filter, pagination, and detail pages
- Zustand domain stores for auth, users, and products
- Axios API abstraction with request interceptor support
- Responsive Material UI layout for desktop and mobile

## Tech Stack
- Next.js 14 (Pages Router)
- React 18
- Material UI (MUI)
- Zustand
- Axios

## Screenshots
### Login
![Login Page](public/screenshots/login-page.png)

### Dashboard
![Dashboard Page](public/screenshots/dashboard-page.png)

### Users
![Users Page](public/screenshots/users-page.png)

### Products
![Products Page](public/screenshots/products-page.png)

## Test Credentials
- Username: emilys
- Password: emilyspass

## Environment Variables
Create a .env.local file from .env.local.example:

NEXT_PUBLIC_API_URL=https://dummyjson.com

## Run Locally
Using npm:
1. npm install
2. npm run dev

Using bun:
1. bun install
2. bun run dev

Open http://localhost:3000 (or the next available port printed in the terminal).

## Production Build
- npm run build
- bun run build

## Folder Structure
help-study-abroad/
- components/
  - Layout.jsx
  - Loader.jsx
  - ProductCard.jsx
  - ProtectedRoute.jsx
  - UserTable.jsx
- lib/
  - api.js
- pages/
  - _app.js
  - index.js
  - login.js
  - dashboard/index.js
  - users/index.js
  - users/[id].js
  - products/index.js
  - products/[id].js
- store/
  - authStore.js
  - userStore.js
  - productStore.js
- styles/
  - globals.css
- theme/
  - index.js

## Architecture Notes
- Domain-first state separation with independent stores
- Reusable layout and UI components across pages
- Centralized API client for consistent request behavior
- Token stored in state and synchronized with localStorage

## Trade-Offs
- Data lists are client-rendered to keep implementation straightforward
- In-memory caching favors speed during navigation over persistence
- Zustand chosen over Redux to reduce boilerplate for this project size

## What I Would Improve Next
- Add unit tests for stores and key reusable components
- Add end-to-end tests for auth and protected-route flows
- Add richer empty and error states with skeleton loaders
- Add table sorting controls for users and products
````markdown

## Features

- Login with DummyJSON credentials and token persistence
- Protected routes with redirect to login for unauthenticated users
- Dashboard summary cards for users, products, and categories
- Users module with search, pagination, and profile detail pages
- Products module with search, category filter, pagination, and detail pages
- Zustand domain stores for auth, users, and products
- Axios API abstraction with request interceptor for auth headers
- Responsive Material UI layout for desktop and mobile
- In-memory caching to avoid repeat API calls during navigation

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14 | Pages Router, SSR-ready routing |
| React | 18 | UI rendering |
| Material UI (MUI) | v5 | Component library and theming |
| Zustand | latest | Lightweight global state management |
| Axios | latest | HTTP client with interceptor support |

---

## Test Credentials

```
Username: emilys
Password: emilyspass
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

A `.env.local.example` file is included for reference.

---

## Run Locally

**Using npm:**

```bash
npm install
npm run dev
```

**Using bun:**

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

```bash
# npm
npm run build
npm start

# bun
bun run build
bun run start
```

---

## Folder Structure

```
help-study-abroad/
├── components/
│   ├── Layout.jsx          # AppBar + Drawer nav shell
│   ├── Loader.jsx          # Centered CircularProgress
│   ├── ProductCard.jsx     # Memoized product grid card
│   ├── ProtectedRoute.jsx  # Auth guard HOC
│   └── UserTable.jsx       # Memoized users table
├── lib/
│   └── api.js              # Axios instance with auth interceptor
├── pages/
│   ├── _app.js             # ThemeProvider + session restore
│   ├── index.js            # Root redirect
│   ├── login.js            # Login page
│   ├── dashboard/
│   │   └── index.js        # Stats overview
│   ├── users/
│   │   ├── index.js        # Users list with search + pagination
│   │   └── [id].js         # Single user detail
│   └── products/
│       ├── index.js        # Products grid with filter + search
│       └── [id].js         # Single product detail + image gallery
├── store/
│   ├── authStore.js        # Login, logout, session restore
│   ├── userStore.js        # Users fetch, search, cache
│   └── productStore.js     # Products fetch, filter, cache
├── styles/
│   └── globals.css
└── theme/
    └── index.js            # MUI theme configuration
```

---

## Architecture Notes

### State Management

Zustand was chosen over Redux for this project. It provides global state with no boilerplate — no Provider wrapper, no reducers, no action creators. Async API calls are handled directly inside store actions, keeping data-fetching logic co-located with the state it updates.

### Caching Strategy

Each list store (users, products) maintains an in-memory cache keyed by `skip-limit` string (e.g. `"0-10"`, `"10-10"`). Before any list fetch, the store checks the cache — if a matching key exists, the API call is skipped and cached data is restored immediately.

This approach:
- Reduces redundant network requests during pagination navigation
- Keeps implementation simple with no external caching library
- Accepts the trade-off that cache is session-scoped and clears on refresh

### API Abstraction

A single Axios instance in `/lib/api.js` handles all HTTP calls. A request interceptor reads the `accessToken` from `localStorage` and attaches it as a `Bearer` token header on every outgoing request — keeping auth logic out of individual components and stores.

### Route Protection

`ProtectedRoute.jsx` is a HOC that wraps every dashboard page. On mount, it checks for a token in Zustand state (restored from localStorage via `initAuth()` in `_app.js`). If no token is found, it immediately redirects to `/login`. This keeps page-level code free of auth concerns.

### Performance

| Technique | Where Applied | Why |
|-----------|--------------|-----|
| `React.memo` | UserTable, ProductCard | Prevents re-render when parent updates with same props |
| `useCallback` | All list page handlers | Stable function references passed to memoized children |
| `useMemo` | Derived display values | Avoids recomputation on unrelated renders |
| API-side pagination | All list fetches | Only current page data is fetched — no large data dumps |
| In-memory cache | userStore, productStore | Skips API call for already-fetched pages |

---

## Trade-Offs

- **Client-rendered lists** — data is fetched client-side to keep implementation straightforward within the assessment time limit. In production, `getServerSideProps` would improve initial load and SEO.

- **Session-scoped cache** — in-memory Zustand cache improves navigation speed but does not persist across page refreshes. A persistent layer (localStorage or SWR) would be more robust in a real application.

- **Zustand over Redux** — appropriate for this project size. Redux would add meaningful structure for a larger team or a more complex domain model.

- **No NextAuth** — the assessment mentioned NextAuth but DummyJSON uses simple token-based auth. Implementing full NextAuth would add unnecessary complexity without functional benefit here.

---

## What I Would Improve Next

- [ ] Unit tests for Zustand stores and reusable components (Jest + RTL)
- [ ] End-to-end tests for auth flow and protected routes (Playwright)
- [ ] Skeleton loaders for list and detail pages during fetch
- [ ] Richer empty states with helpful messaging and retry actions
- [ ] Table column sorting for users (by name, email, company)
- [ ] Product sorting by price, rating, or discount
- [ ] Token refresh using DummyJSON `/auth/refresh` endpoint
- [ ] Error boundary component to gracefully catch unexpected failures
- [ ] Deployed live URL once Vercel deployment is finalized

---

## API Reference

All data sourced from [DummyJSON](https://dummyjson.com/docs).

| Endpoint | Used For |
|----------|---------|
| `POST /auth/login` | User authentication |
| `GET /auth/me` | Verify token on session restore |
| `GET /users?limit=&skip=` | Paginated users list |
| `GET /users/search?q=` | User search |
| `GET /users/{id}` | Single user detail |
| `GET /products?limit=&skip=` | Paginated products list |
| `GET /products/search?q=` | Product search |
| `GET /products/category-list` | All category slugs |
| `GET /products/category/{slug}` | Products by category |
| `GET /products/{id}` | Single product detail |

---

## License

Built for assessment purposes. Not intended for production use.
````
