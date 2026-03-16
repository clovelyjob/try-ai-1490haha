

## Problem

When a logged-in user visits the Pricing page and clicks "Subscribe", the app redirects to `/registro` instead of opening Stripe Checkout. This happens because:

1. `useAuthStore.isAuthenticated` is `false` on page load for real users — the store only persists guest mode data, not real sessions.
2. The `handleSubscribe` function checks this store value instead of checking the actual Supabase session.

## Fix

**In `src/pages/Pricing.tsx`:**

1. Replace the `useAuthStore` dependency with a direct Supabase session check. On mount, call `supabase.auth.getSession()` to determine if the user is logged in.
2. Update `handleSubscribe` to:
   - Check for an active Supabase session (not the Zustand store)
   - If no session, redirect to `/auth` (the unified login/signup page) instead of `/registro`
   - If session exists, proceed with `create-checkout` as normal
3. Update the guest plan CTA to also point to `/auth` or `/guest-start` consistently.

**Scope:** Single file edit (`src/pages/Pricing.tsx`), ~15 lines changed.

