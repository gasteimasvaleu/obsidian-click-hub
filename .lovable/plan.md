

## Fix: Cards slightly behind navbar

**Problem:** Pages using `pt-16` have their top content slightly overlapping behind the fixed navbar.

**Solution:** Change `pt-16` to `pt-20` on all affected pages (excluding `/plataforma` pages).

**Files to update (8 pages):**

1. `src/pages/Audiofy.tsx` — `pt-16` → `pt-20`
2. `src/pages/colorir/ColorirPage.tsx` — `pt-16` → `pt-20`
3. `src/pages/Comunidade.tsx` — `pt-16` → `pt-20`
4. `src/pages/AmigoDivino.tsx` — `pt-16` → `pt-20`
5. `src/pages/colorir/PhotoTransformPage.tsx` — `pt-16` → `pt-20`
6. `src/pages/Oracoes.tsx` — `pt-16` → `pt-20`
7. `src/pages/GuiaPais.tsx` — `pt-16` → `pt-20`
8. `src/pages/colorir/MyCreationsPage.tsx` — `pt-16` → `pt-20`
9. `src/pages/Games.tsx` — `pt-16` → `pt-20`

Simple one-line change per file. No structural or layout changes.

