

## Fix: Revert excessive padding + Add safe-area to bottom menu

### Problem 1: Navbar spacing
The previous fix changed `pt-16` to `pt-20` on all pages, but this created too much gap between the navbar and content. The original problem was a tiny overlap — the fix overcompensated.

**Solution:** Revert all pages back to `pt-16` and instead reduce the FuturisticNavbar's bottom padding from `pb-4` to `pb-2`. This makes the navbar thinner, eliminating the tiny overlap without pushing content too far down.

### Problem 2: Bottom tubelight menu lacks safe-area background
The bottom navigation floats with `mb-9` but has no solid background beneath it, looking disconnected on iOS.

**Solution:** Add a black safe-area strip behind/below the tubelight menu by wrapping it with a background container that extends to the bottom edge of the screen.

### Files to change

1. **`src/components/FuturisticNavbar.tsx`** — Change `pb-4` to `pb-2` on the nav element
2. **`src/components/ui/tubelight-navbar.tsx`** — Add a black safe-area background behind the bottom nav:
   - Wrap the menu in a container with a solid black background strip that covers from the menu to the bottom of the screen
   - Use `pb-[env(safe-area-inset-bottom)]` for proper iOS spacing
   - Reduce `mb-9` to `mb-0` since the safe-area container handles spacing
3. **9 page files** — Revert `pt-20` back to `pt-16`:
   - `src/pages/Audiofy.tsx`
   - `src/pages/colorir/ColorirPage.tsx`
   - `src/pages/Comunidade.tsx`
   - `src/pages/AmigoDivino.tsx`
   - `src/pages/colorir/PhotoTransformPage.tsx`
   - `src/pages/Oracoes.tsx`
   - `src/pages/GuiaPais.tsx`
   - `src/pages/colorir/MyCreationsPage.tsx`
   - `src/pages/Games.tsx`

