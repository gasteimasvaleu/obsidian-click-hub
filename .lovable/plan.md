

## Bug: Double Safe Area on iOS After Closing Chat Keyboard

### Problem
When the Amigo Divino chat opens on iOS and the user taps the textarea (triggering the keyboard), upon closing the keyboard and returning to the page, an extra safe-area gap appears below the tubelight navbar -- creating a "double safe area" effect. This persists even after the chat modal is closed.

### Root Cause
On iOS, when the software keyboard opens, it shifts the visual viewport upward. The `position: fixed; bottom: 0` navbar gets displaced. When the keyboard dismisses, iOS doesn't always fully reset the viewport offset, leaving residual scroll/offset on the page. The current modal only locks `body` scroll, but the actual scroll container is `#root`, so the viewport shift leaks through.

### Fix (1 file: `src/components/ChatInterface.tsx`)

1. **Lock `#root` scroll alongside body** -- The body is already `overflow: hidden` via CSS, but `#root` is the real scroll container (`overflow-y: auto`). Lock it when the modal opens and restore on close.

2. **Reset viewport offset on close** -- When the modal unmounts, call `window.scrollTo(0, 0)` and reset `#root`'s `scrollTop` to ensure iOS doesn't retain a phantom offset from the keyboard interaction.

3. **Use `onClose` cleanup** -- Add a cleanup function that runs when the chat closes to force the viewport back to its correct position, eliminating the residual gap.

### Changes

**`src/components/ChatInterface.tsx`** -- Update the body scroll lock `useEffect`:
- Also target `document.getElementById('root')` to set `overflow: hidden` while modal is open
- On cleanup, restore `#root` overflow and call `window.scrollTo(0, 0)` to reset any iOS viewport shift
- Add `window.visualViewport?.removeEventListener` cleanup to prevent stale height values from persisting

