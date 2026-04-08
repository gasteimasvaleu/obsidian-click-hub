
Objetivo: impedir que o `MainActivity.java` “suma” após `npm run sync:android`.

Diagnóstico
- No código atual, o arquivo existe em `android/app/src/main/java/com/bibliatoonkids/app/MainActivity.java`.
- O comando `sync:android` roda `npx cap sync android && node fix-android-appid.cjs`.
- O problema está no `fix-android-appid.cjs`: hoje ele só:
  - move o arquivo se ele estiver em um caminho “errado”, ou
  - corrige o `package` se ele já existir.
- Se o `cap sync` apagar o arquivo, o script apenas mostra `MainActivity.java não encontrado em nenhum local esperado` e não recria nada.

Implementação
1. Ajustar `fix-android-appid.cjs` para também recriar o arquivo quando ele não existir.
2. Garantir que o script:
   - crie a pasta `android/app/src/main/java/com/bibliatoonkids/app`
   - gere `MainActivity.java` com o conteúdo mínimo correto
   - mantenha o `package com.bibliatoonkids.app;`
3. Preservar as correções já existentes no script para:
   - `android/app/build.gradle`
   - `android/app/src/main/res/values/strings.xml`
   - `android/app/src/main/AndroidManifest.xml`
4. Não mexer no `package.json`, porque `sync:android` já chama o script automaticamente.

Resultado esperado
- Mesmo que o `npx cap sync android` remova o arquivo, o `npm run sync:android` vai recriá-lo no final.
- O Android Manifest continuará apontando para `.MainActivity`.
- O build local deixará de depender de recriação manual do arquivo.

Arquivos envolvidos
- `fix-android-appid.cjs`
- validação indireta com:
  - `android/app/src/main/java/com/bibliatoonkids/app/MainActivity.java`
  - `android/app/src/main/AndroidManifest.xml`
  - `android/app/build.gradle`

Detalhes técnicos
```text
Fluxo atual:
cap sync -> pode apagar MainActivity -> script só avisa -> build quebra

Fluxo após a correção:
cap sync -> arquivo some -> script recria pasta/arquivo -> build segue normal
```

Conteúdo que o script deve garantir no arquivo
```java
package com.bibliatoonkids.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {}
```

Validação depois da implementação
1. Rodar:
   - `npx vite build`
   - `npm run sync:android`
2. Confirmar que o arquivo continua existindo em:
   - `android/app/src/main/java/com/bibliatoonkids/app/MainActivity.java`
3. Abrir no Android Studio:
   - Clean Project
   - Rebuild Project
4. Testar no emulador antes de gerar AAB.

Observação importante
- Pelo estado atual do repositório, o bug não é “o arquivo nunca existiu”; o bug é “o script não se recupera quando o sync apaga o arquivo”. A correção mais segura é automatizar essa recriação no próprio `fix-android-appid.cjs`.
