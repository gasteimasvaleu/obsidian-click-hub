

## Atualizar versão para Build 33

Três arquivos precisam ser atualizados:

1. **`ios/App/App.xcodeproj/project.pbxproj`** — `CURRENT_PROJECT_VERSION` de 32 → 33 (2 ocorrências: Debug e Release)
2. **`android/app/build.gradle`** — `versionCode` de 32 → 33
3. **`src/lib/revenuecat.ts`** — `APP_BUNDLE_VERSION` para `'2026-03-12-v3'` (marcador de bundle atualizado)

