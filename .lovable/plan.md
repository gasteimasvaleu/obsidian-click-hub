

## Plan: Add detailed error logging to Google Sign-In

**Problem**: The catch block at line 188 shows a generic "Erro ao fazer login com Google" without the actual error details, making it impossible to diagnose the real issue.

**Solution**: Update the catch block in `handleGoogleSignIn` to display the actual error message in the toast, so you can see exactly what's failing (whether it's the native Google SDK or Supabase rejecting the token).

### Changes

**File: `src/pages/Login.tsx`**

Update the catch block (lines 183-189) to include the real error message:

```typescript
} catch (error: any) {
  console.error('Google Sign In error:', error);
  if (error?.message?.includes('canceled') || error?.message?.includes('cancelled')) {
    // User cancelled
  } else {
    toast.error(`Erro ao fazer login com Google: ${error?.message || JSON.stringify(error)}`);
  }
}
```

This will show the exact error on screen next time you try, so we can identify if it's:
- A native Google SDK issue (token not returned)
- Supabase rejecting the token (wrong Client ID/Secret config)
- A network error

After seeing the real error, we can apply the correct fix.

