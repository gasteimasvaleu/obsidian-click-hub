
Objetivo: corrigir de forma definitiva o erro local do Xcode “The sandbox is not in sync with the Podfile.lock”.

Diagnóstico
- O problema não parece ser o `Podfile.lock` em si.
- O arquivo `ios/App/App.xcodeproj/project.pbxproj` está sem a integração esperada do CocoaPods:
  - não há `PBXShellScriptBuildPhase`
  - não há fase `[CP] Check Pods Manifest.lock`
  - não há referências `Pods-App.debug.xcconfig` / `Pods-App.release.xcconfig`
  - só existe `ios/debug.xcconfig`; `ios/release.xcconfig` não existe
- Também há dois gatilhos que reaplicam `fix-signing.cjs` depois do sync:
  - `package.json` em `build:ios` e `sync:ios`
  - `ios/App/App/capacitor.config.json` com `"cap-sync-after": "node fix-signing.cjs"`
- Isso explica por que o erro “sandbox” permanece: o projeto iOS local fica fora do formato esperado pelo CocoaPods, mesmo quando `Podfile.lock` e `Manifest.lock` batem.

O que será alterado
1. Ajustar a ordem do workflow iOS
- Fazer `fix-signing.cjs` rodar antes da reinstalação final dos pods.
- Garantir que o último passo estrutural no iOS seja o CocoaPods, não o script de signing.

2. Corrigir os scripts do `package.json`
- Atualizar:
  - `build:ios`
  - `sync:ios`
- Nova ordem:
```text
npm run build
→ npx cap sync ios
→ node fix-signing.cjs
→ cd ios/App && pod install
```

3. Remover o gatilho duplicado de pós-sync
- Remover o hook `"cap-sync-after": "node fix-signing.cjs"` de `ios/App/App/capacitor.config.json`.
- Isso evita que o arquivo do Xcode seja reescrito novamente depois que o CocoaPods terminar.

4. Restaurar compatibilidade de configuração do Xcode com CocoaPods
- Criar `ios/release.xcconfig`.
- Atualizar `ios/debug.xcconfig` para incluir o xcconfig do Pods.
- Fazer `ios/release.xcconfig` incluir o xcconfig de Release do Pods.

Estrutura esperada:
```text
ios/debug.xcconfig
#include? "App/Pods/Target Support Files/Pods-App/Pods-App.debug.xcconfig"
CAPACITOR_DEBUG = true

ios/release.xcconfig
#include? "App/Pods/Target Support Files/Pods-App/Pods-App.release.xcconfig"
```

5. Ajustar `project.pbxproj`
- Adicionar referência ao `release.xcconfig`.
- Garantir que:
  - Project Debug → `debug.xcconfig`
  - Project Release → `release.xcconfig`
  - Target Debug → `debug.xcconfig`
  - Target Release → `release.xcconfig`
- Preservar assinatura manual já válida:
  - bundle id
  - team id
  - provisioning profile
  - signing certificate

6. Endurecer `fix-signing.cjs`
- Limitar o script para alterar apenas campos de signing do target do app.
- Não mexer em:
  - `baseConfigurationReference`
  - build phases
  - blocos de CocoaPods/SPM
  - configurações globais que o CocoaPods usa
- Isso evita que futuros `sync:ios` quebrem a integração outra vez.

7. Recuperação local após as mudanças
- Depois de implementar, o fluxo recomendado no Mac ficará:
```text
git pull
npm install
npm run sync:ios
abrir ios/App/App.xcworkspace
```
- Se o projeto local já estiver “quebrado”, fazer uma limpeza única dos Pods/DerivedData antes de testar novamente.

Resultado esperado
- O Xcode volta a reconhecer corretamente a instalação do CocoaPods.
- O erro “sandbox is not in sync with the Podfile.lock” desaparece.
- O projeto continua com assinatura manual compatível com seu Appflow/App Store.
- O fluxo iOS fica previsível para os próximos syncs.

Detalhes técnicos
- O erro atual é coerente com um `project.pbxproj` sem integração completa do CocoaPods, não com falta de `pod install`.
- A ausência de `PBXShellScriptBuildPhase` e de `Pods-App.*.xcconfig` no projeto é o indício mais forte.
- O problema provavelmente “funcionava antes” porque existia um estado local antigo válido no Xcode/Pods; depois algum sync reaplicou o script de signing e deixou o projeto num estado híbrido.
