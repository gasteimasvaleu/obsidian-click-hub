

## Plan: Remove GlassCard from Family Policy Link

Replace the `GlassCard` wrapper with a simple `div` keeping the same icon + text link style.

### Change

**`src/pages/Index.tsx`** (lines ~149-155):
- Remove the `GlassCard` wrapper around the "Política de Famílias e Privacidade" link
- Replace with a plain `div` with `flex items-center justify-center gap-2 cursor-pointer` and the `onClick` handler
- Keep the `ShieldCheck` icon and `span` text as-is

