

## Diagnóstico

A `MainActivity.java` atual chama `GoogleProvider.Companion.handleOnActivityResult(...)` na linha 12, mas essa API não existe no plugin `@capgo/capacitor-social-login`. A documentação oficial do Capgo mostra um padrão diferente que usa `GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MIN/MAX` e `SocialLoginPlugin.handleGoogleLoginIntent()`.

## Plano

Atualizar a `MainActivity.java` e o script `fix-android-appid.cjs` para usar o código correto da documentação oficial:

### Arquivo 1: `android/app/src/main/java/com/bibliatoonkids/app/MainActivity.java`

Substituir o conteúdo por:

```java
package com.bibliatoonkids.app;

import android.content.Intent;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginHandle;
import ee.forgr.capacitor.social.login.GoogleProvider;
import ee.forgr.capacitor.social.login.SocialLoginPlugin;
import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin;

public class MainActivity extends BridgeActivity implements ModifiedMainActivityForSocialLoginPlugin {
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode >= GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MIN && requestCode < GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MAX) {
            PluginHandle pluginHandle = getBridge().getPlugin("SocialLogin");
            if (pluginHandle == null) {
                Log.i("Google Activity Result", "SocialLogin login handle is null");
                return;
            }
            Plugin plugin = pluginHandle.getInstance();
            if (!(plugin instanceof SocialLoginPlugin)) {
                return;
            }
            ((SocialLoginPlugin) plugin).handleGoogleLoginIntent(requestCode, data);
        }
    }

    @Override
    public void IHaveModifiedTheMainActivityForTheUseWithSocialLoginPlugin() {}
}
```

### Arquivo 2: `fix-android-appid.cjs`

Atualizar o template `mainActivityContent` dentro do script com o mesmo código acima, para que futuras execuções de `npm run sync:android` gerem o arquivo correto.

### Por que isso resolve

- O código antigo chamava `GoogleProvider.Companion` (API Kotlin que não existe na versão atual do plugin)
- O código novo usa a API documentada: verifica o range do `requestCode` e delega para `SocialLoginPlugin.handleGoogleLoginIntent()`
- Após essa correção, o build no Android Studio deve compilar sem erros

