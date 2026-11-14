# Project Architecture Rules

- Keep primary and secondary navigation definitions in `App.tsx` and `tubelight-navbar.tsx`, while home feature cards remain page-level content, so each navigation surface has a single source of truth.
- The light violet theme lives in global `:root` tokens in `src/index.css`; admin routes opt back into dark via the `.dark` wrapper in `ProtectedRoute`, so one token set drives every user-facing screen.
