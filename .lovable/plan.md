

# Corrigir pacote Android sem afetar iOS

## Situação atual

| Plataforma | Bundle ID atual | Bundle ID correto |
|------------|----------------|-------------------|
| **iOS** | `com.bibliatoonkids.app` | `com.bibliatoonkids.app` ✅ |
| **Android** | `com.caio.bibliatoonkids` | `br.com.caio.bibliatoonkids` ❌ |

O `capacitor.config.ts` tem `appId: 'com.bibliatoonkids.app'`, que é o ID do iOS. O Android já usa um `applicationId` diferente definido diretamente no `build.gradle` — o `appId` do Capacitor config **não sobrescreve** o `applicationId` do `build.gradle` quando já está definido lá.

## Plano — alterar APENAS arquivos Android

Não mexer no `capacitor.config.ts` nem em nenhum arquivo iOS. As mudanças ficam restritas a:

1. **`android/app/build.gradle`** — alterar `namespace` e `applicationId` de `com.caio.bibliatoonkids` para `br.com.caio.bibliatoonkids`
2. **`android/app/src/main/res/values/strings.xml`** — alterar `package_name` e `custom_url_scheme` para `br.com.caio.bibliatoonkids`

## Passos locais obrigatórios (após git pull)

1. Deletar a pasta `android/` inteira
2. `npx cap add android`
3. `npx cap sync android`
4. Isso recriará o `MainActivity.java` com o pacote correto (`br/com/caio/bibliatoonkids/`)
5. Verificar que o `versionCode` no `build.gradle` gerado é `29` (se for resetado, corrigir manualmente)
6. Gerar o AAB

O iOS permanece 100% intacto.

