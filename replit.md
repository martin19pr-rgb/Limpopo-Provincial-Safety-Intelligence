# Provincial Safety Intelligence — Limpopo

A government dashboard application for the Limpopo Provincial Safety Intelligence Command Center. Built with React, Vite, TypeScript, Tailwind CSS, and Shadcn/UI.

## Architecture

- **Framework**: React 18 + Vite 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI components
- **Routing**: React Router v6
- **State/Data**: TanStack Query
- **Maps**: Leaflet + React Leaflet
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Auth**: Local session-based auth (localStorage) via `src/lib/auth.ts`
- **Real-time**: Firebase Firestore + Realtime Database
- **Notifications**: Sonner

## Structure

```
src/
  App.tsx             # Root app with routing
  pages/              # Route-level page components
    Index.tsx
    UnifiedCommandDashboard.tsx
    PremierDashboard.tsx
    SAPSDashboard.tsx
    EMSDashboard.tsx
    TransportDashboard.tsx
    HealthDashboard.tsx
    RoadsAgencyDashboard.tsx
    AuthLogin.tsx
    GovOnboarding.tsx
    NotFound.tsx
  components/         # Shared UI components
    DashboardLayout.tsx
    ui/               # Shadcn/UI primitives
  lib/
    auth.ts           # Local session auth (replaces Supabase Auth)
    firebase.ts       # Firebase real-time integration
  data/
    mockData.ts       # Static mock data
  assets/             # Government emblems & images
```

## Authentication

Auth is handled locally via `src/lib/auth.ts` using `localStorage`. No external auth provider is required. Sessions persist across page reloads.

## Running the App

```bash
npm run dev    # Starts on port 5000
npm run build  # Production build
```

## Notes

- All dashboard data comes from `src/data/mockData.ts`
- Firebase is configured with hardcoded credentials in `src/lib/firebase.ts` for real-time updates
- The app runs on port 5000 for Replit webview compatibility
- Supabase has been removed — auth is now fully local
