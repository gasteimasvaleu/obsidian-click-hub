# Project Architecture Rules

- Keep primary and secondary navigation definitions in `App.tsx` and `tubelight-navbar.tsx`, while home feature cards remain page-level content, so each navigation surface has a single source of truth.
- The light violet theme lives in global `:root` tokens in `src/index.css`; admin routes opt back into dark via the `.dark` wrapper in `ProtectedRoute`, so one token set drives every user-facing screen.
- Profile appearance updates shared user accent and glow variables; light page/navigation scopes reference those variables, while feature category, status, artwork, and admin colors stay independent, so personalization reaches all accent-driven UI without erasing meaningful colors.
- User-facing pages share the Bíblia page width: outer `container px-4 max-w-[58rem]` (or `px-4` wrapper + inner `max-w-4xl`); `PlataformaLayout` caps children at `max-w-[58rem]`, so every screen has identical side margins on desktop/tablet.
- The Bible study chat (`/estudo`) persists threads in `bible_studies`/`bible_study_messages` and the `bible-study-chat` Edge Function loads history and saves both turns server-side, so the client never sends history it could forge.
