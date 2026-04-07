

## Unificar Package Name Android para `com.bibliatoonkids.app`

### Contexto
O app Android suspenso usava `br.com.caio.bibliatoonkids`. O iOS usa `com.bibliatoonkids.app`. Vamos usar esse mesmo identificador para o novo app Android, já que ele nunca foi publicado no Google Play.

### Alterações (3 arquivos + 1 movimentação)

**1. `fix-android-appid.cjs`** — Atualizar `CORRECT_PACKAGE` para `com.bibliatoonkids.app` e `CORRECT_PACKAGE_DIR` para `com/bibliatoonkids/app`. Como agora o package correto é igual ao que o Capacitor já gera, o script basicamente vira um no-op — mas mantemos por segurança.

**2. `android/app/build.gradle`** — Atualizar `namespace` e `applicationId` para `com.bibliatoonkids.app`. Resetar `versionCode` para 1.

**3. `android/app/src/main/res/values/strings.xml`** — Atualizar `package_name` e `custom_url_scheme` para `com.bibliatoonkids.app`.

**4. Mover `MainActivity.java`** — De `br/com/caio/bibliatoonkids/` para `com/bibliatoonkids/app/` e atualizar declaração `package` para `com.bibliatoonkids.app`.

### O que NÃO muda
- `capacitor.config.ts` — já usa `com.bibliatoonkids.app`
- iOS — zero impacto
- Keystore `novakey.jks` — reutilizável, só registrar o SHA-1 no novo app

### Passos manuais depois
1. **Google Play Console** — Criar novo app com package `com.bibliatoonkids.app`
2. **Google Cloud Console** — Adicionar `com.bibliatoonkids.app` ao Android OAuth Client ID (mesmo SHA-1)
3. **RevenueCat** — Criar novo app Android com `com.bibliatoonkids.app`, vincular aos mesmos produtos
4. **RTDN** — Apontar para o mesmo tópico Pub/Sub existente

