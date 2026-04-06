# National Safety Intelligence Command Centre (LSISTH)

## Overview
A government dashboard application for the National Safety Intelligence Command Centre of the Kingdom of Lesotho. Provides a unified, real-time interface for monitoring national safety, emergency responses, and departmental performance across Police (LMPS), EMS, Transport, Health, Roads, Electricity (LEC), and Fire & Rescue (LNFRS).

## Tech Stack
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Real-time Backend**: Firebase (Firestore + Realtime Database)
- **Authentication**: Local session-based auth (localStorage)
- **Maps**: Leaflet + React Leaflet
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Notifications**: Sonner

## Project Structure
```
src/
  assets/        # Government emblems and images
  components/    # UI components (AlertCard, SmartProvincialMap, etc.)
    ui/          # shadcn/ui primitives
  data/          # Mock data and TypeScript types
  hooks/         # Custom React hooks
  lib/           # Utilities: auth.ts, firebase.ts
  pages/         # Dashboard pages per department
  test/          # Test setup
```

## Key Files
- `src/App.tsx` - Root component with routing and providers
- `src/main.tsx` - Entry point
- `src/lib/firebase.ts` - Firebase configuration and exports
- `src/lib/auth.ts` - Local session auth (signIn, signUp, signOut)
- `src/data/mockData.ts` - Static data for alerts, workers, KPIs
- `src/components/DashboardLayout.tsx` - Main layout with sidebar

## Environment Variables
All Firebase config values are stored as Replit environment variables (VITE_FIREBASE_*):
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID

## Running the App
```bash
npm run dev   # starts Vite dev server on port 5000
npm run build # production build
```

## Notes
- Supabase integration was removed (was never actively used - no tables, no app-level calls)
- Firebase Firestore handles real-time incident/alert data
- Authentication is local (localStorage-based), no external auth provider
- The PostgreSQL database (DATABASE_URL) is available but currently unused by the app
