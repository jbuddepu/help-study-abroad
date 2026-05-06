# Help Study Abroad — Frontend Assessment

## Overview
Admin dashboard built with Next.js, MUI, and Zustand. 
Connects to DummyJSON REST API for users and products data.

## Tech Stack
| Tech | Version | Reason |
|------|---------|--------|
| Next.js | 14 | Pages Router for simplicity |
| MUI | v5 | Required by assessment |
| Zustand | latest | Lightweight state, no boilerplate |
| Axios | latest | Clean HTTP client with interceptors |

## Why Zustand over Redux?
Zustand provides global state with minimal setup — no Provider,
no reducers, no action creators. Async actions work directly
inside store functions. Ideal for small-to-medium apps.

## Setup & Run
git clone <your-repo>
cd help-study-abroad
npm install
cp .env.local.example .env.local   # see below
npm run dev

## Environment Variables (.env.local)
NEXT_PUBLIC_API_URL=https://dummyjson.com

## Test Credentials
Username: emilys
Password: emilyspass

## Features
- [x] Login with DummyJSON auth (accessToken storage)
- [x] Protected routes (token-based guard)
- [x] Users list: pagination + search
- [x] User detail page: full profile
- [x] Products list: pagination + search + category filter
- [x] Product detail: image gallery + specs
- [x] Zustand stores with async actions + in-memory caching
- [x] Responsive MUI layout (mobile + desktop)
- [x] React.memo, useCallback, useMemo optimizations

## Folder Structure
```text
help-study-abroad/
├── components/
│   ├── Layout.jsx
│   ├── Loader.jsx
│   ├── ProductCard.jsx
│   ├── ProtectedRoute.jsx
│   └── UserTable.jsx
├── lib/
│   └── api.js
├── pages/
│   ├── _app.js
│   ├── index.js
│   ├── login.js
│   ├── dashboard/
│   │   └── index.js
│   ├── products/
│   │   ├── [id].js
│   │   └── index.js
│   └── users/
│       ├── [id].js
│       └── index.js
├── store/
│   ├── authStore.js
│   ├── productStore.js
│   └── userStore.js
├── styles/
│   └── globals.css
├── theme/
│   └── index.js
├── .env.local.example
├── jsconfig.json
├── next.config.js
├── package.json
└── README.md
```

## Caching Strategy
In-memory Zustand cache keyed by "skip-limit" string.
Avoids repeat API calls when navigating back to same page.
Cache is session-scoped (cleared on browser refresh).
