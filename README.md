# Fatima Ghacham Portfolio

React, Vite, and Express portfolio app with Supabase-backed projects, blog posts, contact messages, and admin content management.

## Run Locally

1. Install dependencies:
   `npm install`
2. Create `.env.local` with:
   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
3. Run the app:
   `npm run dev`

Use `supabase/schema.sql` to create the database tables, RLS policies, and admin profile support.
