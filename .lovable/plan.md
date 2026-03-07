

## Plano: Script de automação pós-sync Android

Você já corrigiu tudo manualmente. Agora vamos criar apenas a automação para proteger essas mudanças em futuros syncs.

### 1. Criar `fix-android-appid.cjs`
Script Node.js que, após o `cap sync android`, corrige automaticamente:
- `namespace` e `applicationId` no `build.gradle`
- `package_name` e `custom_url_scheme` no `strings.xml`
- Move `MainActivity.java` para `com/caio/bibliatoonkids/` e corrige o `package`

### 2. Editar `package.json`
Adicionar:
```json
"sync:android": "npx cap sync android && node fix-android-appid.cjs"
```

### Uso futuro
Em vez de `npx cap sync android`, rodar `npm run sync:android` — tudo corrigido automaticamente.

