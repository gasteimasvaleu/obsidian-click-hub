

## Plano: Renomear app de "KIDS" para "Club"

Atualizar o `appName` em todos os arquivos de configuração para refletir o novo nome.

### Arquivos a alterar:

1. **`capacitor.config.ts`** (linha 5): `appName: 'BíbliaToon Club'`
2. **`ios/App/App/capacitor.config.json`** (linha 3): `"appName": "BíbliaToon Club"`
3. **`android/app/src/main/res/values/strings.xml`**: Atualizar `app_name` e `title_activity_main` para "BíbliaToon Club"
4. **`public/manifest.webmanifest`**: Atualizar `name` e `short_name` se existirem
5. **`index.html`**: Atualizar título e meta tags que mencionam "KIDS"

Após implementar, rodar localmente: `git pull && npm install && npm run build && npx cap sync ios && node fix-signing.cjs`, depois Clean Build Folder + deletar app do simulador antes de reinstalar.

