# Room Share App - Mobile Development Context

This document contains the necessary context to start a React Native / Mobile project sharing the same backend as the "next-room-share" web project.

## 1. Backend & Database (Supabase)
The mobile app will connect to the **same Supabase instance** as the web app.

- **Supabase URL**: `process.env.NEXT_PUBLIC_SUPABASE_URL` (Retrieve from `.env.local` of web project)
- **Anon Key**: `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` (Retrieve from `.env.local` of web project)
- **Auth**: Uses Supabase Auth (Email/Password). Ensure same `auth` schema is used.
- **Database Schema**:
    - `listings`: Property information (title, price, image, etc.)
    - `stories`: User stories/blogs
    - `users`: User profiles (id links to auth.users)
    - `messages`: Chat messages between users

## 2. Key Features to Port
These are the core functionalities implemented in the web app that need to be rebuilt in React Native:

1.  **Search & Filtering**:
    - Filter by Area (Prefecture/City), Station, Rent, Gender, Amenities.
    - Logic reference: `lib/fetch-listings-server.ts` (Server-side) and `components/search/SearchClient.tsx` (Client-side).
2.  **Property Listings**:
    - List view (Horizontal/Vertical cards).
    - Detail view (Image gallery, map, stats).
    - Logic reference: `app/search/page.tsx`, `app/rooms/[id]/page.tsx`.
3.  **Stories (Blog)**:
    - List view and Detail view.
    - Edit/Delete functionality for owners.
    - Logic reference: `app/stories/page.tsx`, `app/stories/[id]/page.tsx`.
4.  **Host / Post Property**:
    - Form to submit new listings (Image upload to Supabase Storage).
    - Logic reference: `app/host/page.tsx`.
5.  **Inquiry / Chat**:
    - Contact form for properties.
    - Logic reference: `app/rooms/[id]/contact/page.tsx`.

## 3. Shared Logic (Copy & Paste Candidates)
While UI needs rewrite, business logic can be reused:
- **Supabase Client**: `lib/supabase.ts` (Need to adapt storage persistence for React Native, use `AsyncStorage`).
- **Data Types/Interfaces**: Copy `types` definitions.
- **Constants**: `data/pref_line_station_full.json`, `amenityOptions` arrays.

## 4. Next Steps for New Project
1.  Initialize React Native (Expo) project.
2.  Install `@supabase/supabase-js`.
3.  Copy `.env` variables from Web project.
4.  Copy `lib/supabase.ts` and configure it for React Native (using AsyncStorage).
5.  Start porting `app/page.tsx` (Home Screen).
