

## Plan: Make /sobre page publicly accessible

**Why**: Google's OAuth verification team needs to access the homepage URL (`app.bibliatoonkids.com/sobre`) without being logged in. Currently, the route is wrapped in `<ProtectedRoute>`, which redirects unauthenticated users to login.

**Change**: In `src/App.tsx`, change the `/sobre` route from:
```tsx
<Route path="/sobre" element={<ProtectedRoute><Sobre /></ProtectedRoute>} />
```
to:
```tsx
<Route path="/sobre" element={<Sobre />} />
```

This is a single-line change. No other files need modification.

