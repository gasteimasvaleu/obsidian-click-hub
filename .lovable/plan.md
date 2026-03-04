

## Plano: Alinhar versão Android com iOS

### Versões atuais

| Plataforma | Version Name | Version Code / Build |
|-----------|-------------|---------------------|
| iOS       | 1.0         | 28                  |
| Android   | 2.0         | 2                   |

### O que fazer

**No código (eu faço):**
- Alterar `android/app/build.gradle`:
  - `versionCode 2` → `versionCode 28`
  - `versionName "2.0"` → `versionName "1.0"`

Isso alinha o Android com o iOS: **versão 1.0, build 28**.

**No Android Studio (você NÃO precisa alterar manualmente):**
- O Android Studio lê o `build.gradle` automaticamente. Depois do `git pull` e `npx cap sync android`, ao abrir o projeto no Android Studio ele já vai pegar a versão correta.
- Basta gerar o AAB (Build → Generate Signed Bundle) e enviar.

**Importante:** Como o Google Play já recebeu `versionCode 2`, o novo `versionCode 28` é maior, então será aceito sem problemas. O Google exige apenas que o versionCode seja **maior** que o anterior.

### Resumo de todas as mudanças planejadas (incluindo o plano anterior)

1. **`src/lib/revenuecat.ts`** — Desabilitar RevenueCat no Android
2. **`android/app/build.gradle`** — versionCode 28, versionName "1.0"
3. **`src/pages/PoliticaFamilia.tsx`** — Nova página de Política de Família
4. **`src/pages/Index.tsx`** — Link para a página de política
5. **`src/App.tsx`** — Registrar rota `/politica-familia`
6. **`src/pages/Login.tsx`** — Ajustar botões de assinatura por plataforma

