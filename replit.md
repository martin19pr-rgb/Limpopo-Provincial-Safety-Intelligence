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
- **Auth**: Supabase Auth (email/password + biometric UI)
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
  integrations/
    supabase/         # Supabase client + types
  data/
    mockData.ts       # Static mock data
  assets/             # Government emblems & images
```

## Environment Variables

Set via Replit environment panel:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon/public key
- `VITE_SUPABASE_PROJECT_ID` — Supabase project ID

## Running the App

```bash
npm run dev    # Starts on port 5000
npm run build  # Production build
```

## Notes

- Supabase is used only for authentication (no custom database tables)
- All dashboard data comes from `src/data/mockData.ts`
- The app runs on port 5000 for Replit webview compatibility
