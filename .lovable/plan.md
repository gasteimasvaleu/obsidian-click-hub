
## Diagnóstico

O app **não está travando no splash React** — ele está travando **antes** de chegar ao React.

### Causa raiz

O `@capgo/capacitor-social-login` está no `package.json`, mas **não foi registrado** nos arquivos nativos do Android:

- `android/capacitor.settings.gradle` — **não inclui** `capgo-capacitor-social-login`
- `android/app/capacitor.build.gradle` — **não inclui** `capgo-capacitor-social-login` nas dependencies

Porém, o `MainActivity.java` importa classes desse plugin:
```
import ee.forgr.capacitor.social.login.GoogleProvider;
import ee.forgr.capacitor.social.login.SocialLoginPlugin;
import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin;
```

Resultado: o Android **compila com erro** (ou falha silenciosamente no runtime), a `MainActivity` não inicia, o WebView nunca carrega, e o app fica preso na tela nativa de splash (aquele ícone de play genérico do Capacitor).

**Antes funcionava** porque o `MainActivity.java` original não tinha essas importações — era um `BridgeActivity` simples. As alterações que fizemos para o plugin de auth adicionaram imports e código que dependem do plugin estar registrado nativamente, mas o `npx cap sync` aparentemente não registrou o plugin no Gradle.

### Plano de correção

1. **Adicionar o plugin social-login aos arquivos Gradle do Android**
   - `android/capacitor.settings.gradle`: adicionar `include ':capgo-capacitor-social-login'` com o path correto
   - `android/app/capacitor.build.gradle`: adicionar `implementation project(':capgo-capacitor-social-login')` nas dependencies

2. **Verificar que o `MainActivity.java` está consistente** com o plugin registrado (já está correto no código atual)

3. **Atualizar o script `fix-android-appid.cjs`** para incluir essas linhas caso precise recriar os arquivos nativos no futuro

### Instruções para o usuário após a correção

Depois de aprovar, você precisará:
1. `git pull`
2. `npm install` (para garantir que o `@capgo/capacitor-social-login` está instalado)
3. `npx cap sync android`
4. Reabrir no Android Studio e rodar

### Por que isso resolve

O `MainActivity.java` poderá resolver as classes `ee.forgr.capacitor.social.login.*`, a Activity iniciará normalmente, o WebView carregará o bundle React, e o splash React (já corrigido com `useRef` + timeout de 6s) seguirá para a tela de login.
