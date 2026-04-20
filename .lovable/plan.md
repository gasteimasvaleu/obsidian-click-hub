

## Atualizar versão Android para novo upload na Play Console

A Play Console exige `versionCode` único e maior a cada upload. A versão atual é `versionCode 5` / `versionName "2.2.0"`.

## Mudança

### Arquivo: `android/app/build.gradle`

```diff
-        versionCode 5
-        versionName "2.2.0"
+        versionCode 6
+        versionName "2.2.1"
```

## O que NÃO muda
- Nenhum arquivo iOS, web, Supabase ou Capacitor
- `WEB_CLIENT_ID` permanece a correção anterior

## Pós-edição (local no seu Mac)

```bash
git pull
npm run sync:android
```

Depois no Android Studio:
1. Build → Generate Signed Bundle (AAB)
2. Upload para Internal Testing na Play Console
3. Atualizar via Play Store no aparelho e testar "Continuar com Google"

## Observação
Se preferir outro `versionName` (ex: `2.3.0` para sinalizar correção de auth), me avise antes de aprovar. Mantive `2.2.1` por ser uma correção pontual (patch).

