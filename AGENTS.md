# Project Architecture Rules

- Keep primary and secondary navigation definitions in `App.tsx` and `tubelight-navbar.tsx`, while home feature cards remain page-level content, so each navigation surface has a single source of truth.
- Scope the initial light-theme preview to the home page and its navigation using local CSS tokens; internal screens retain their existing theme until separately redesigned.
