
Objetivo: garantir que o `MainActivity.java` não desapareça após `npm run sync:android`.

O que observei no código atual
- O repositório já está configurado para rodar:
  ```text
  npx cap sync android && node fix-android-appid.cjs
  ```
- O arquivo `fix-android-appid.cjs` já contém lógica para:
  - corrigir `build.gradle`
  - corrigir `strings.xml`
  - corrigir `AndroidManifest.xml`
  - recriar `android/app/src/main/java/com/bibliatoonkids/app/MainActivity.java` se ele não existir
  - sobrescrever o arquivo com conteúdo canônico se ele existir mas estiver corrompido
- No código atual, `MainActivity.java` existe no caminho correto e o `AndroidManifest.xml` aponta para `.MainActivity`.

Diagnóstico provável
- Se o arquivo “sumiu depois do sync” no seu ambiente, o mais provável é um destes casos:
  1. seu local ainda não está com a versão mais nova do `fix-android-appid.cjs`
  2. o `sync` foi rodado em uma cópia/branch desatualizada
  3. o `cap sync` removeu o arquivo, mas o script corretivo não chegou a rodar ou não era a versão atual

Plano
1. Confirmar se o seu ambiente local está com a versão atual do `fix-android-appid.cjs`.
2. Validar se o script `sync:android` continua chamando `node fix-android-appid.cjs` depois do `cap sync`.
3. Se estiver desatualizado, atualizar o projeto local antes de sincronizar de novo.
4. Se mesmo com a versão atual o problema persistir, endurecer a automação para:
   - sempre garantir a pasta `android/app/src/main/java/com/bibliatoonkids/app`
   - sempre escrever o conteúdo canônico de `MainActivity.java` ao final do sync
   - opcionalmente falhar com mensagem clara se o arquivo não existir após a correção
5. Documentar a ordem correta do fluxo Android para evitar perda de arquivos nativos.

Fluxo recomendado
```text
1. Atualizar o projeto local
2. Gerar o build web
3. Rodar o sync Android
4. Confirmar que MainActivity.java existe
5. Só então abrir/rebuildar no Android Studio
```

Detalhes técnicos
```text
Arquivo esperado:
android/app/src/main/java/com/bibliatoonkids/app/MainActivity.java

Conteúdo esperado:
package com.bibliatoonkids.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {}
```

```text
Manifest esperado:
android:name=".MainActivity"
```

Resultado esperado
- O `MainActivity.java` deixa de depender de recriação manual.
- O sync Android volta a ser previsível.
- O build no Android Studio não quebra por ausência da activity principal.
