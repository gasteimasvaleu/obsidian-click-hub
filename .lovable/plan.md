

# Alinhar versão do Android com iOS (28 → 29)

## Problema
- **iOS**: `CURRENT_PROJECT_VERSION = 29` ✅
- **Android**: `versionCode 28` ❌ (desatualizado)

## Correção

**`android/app/build.gradle`** (linha 10):
- Alterar `versionCode 28` para `versionCode 29`

Apenas uma linha precisa ser alterada. Após a implementação, lembre-se de rodar `npx cap sync android` localmente antes do próximo upload ao Google Play.

