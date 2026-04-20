

## Bump de versão Android (novo upload)

A Play Console rejeita reenvio com mesmo `versionCode`. Vamos subir de `6 / 2.2.1` para `7 / 2.2.2`.

## Mudança

### Arquivo: `android/app/build.gradle`

```diff
-        versionCode 6
-        versionName "2.2.1"
+        versionCode 7
+        versionName "2.2.2"
```

## O que NÃO muda
- iOS, web, Supabase, Capacitor
- `WEB_CLIENT_ID` (correção anterior preservada)

## Pós-edição (local no seu Mac)

```bash
git pull
npm run sync:android
```

Depois no Android Studio:
1. Build → Generate Signed Bundle (AAB)
2. Upload para Internal Testing na Play Console
3. Atualizar via Play Store no aparelho e testar "Continuar com Google"

