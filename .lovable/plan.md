
Objetivo: eliminar definitivamente o erro `{"code":"UNIMPLEMENTED"}` no botão **Continuar com Apple** no iOS nativo.

Diagnóstico confirmado:
- O erro não é do RevenueCat (compra está ok).
- O erro é do bridge do Capacitor: o JS chama `NativeAppleSignIn`, mas o plugin não está carregado no runtime iOS.
- Arquivo crítico isolado: `ios/App/App.xcodeproj/project.pbxproj` atualmente **não contém** `NativeAppleSignInPlugin.swift` nem `NativeAppleSignInPlugin.m` no target App (só `AppDelegate.swift` está em Sources).
- `ios/App/App/capacitor.config.json` já tem `NativeAppleSignInPlugin`, mas isso sozinho não resolve se a classe nativa não foi compilada.
- `capacitor.config.ts` (fonte de verdade do `cap sync`) ainda não tem `packageClassList`, então um `cap sync` pode sobrescrever a config iOS e remover registro customizado.

Do I know what the issue is? **Sim**: o plugin local existe no disco, mas não está corretamente integrado ao build/registro nativo de forma persistente.

Plano de implementação:
1) Corrigir integração nativa no Xcode project (persistente em código)
- Editar `ios/App/App.xcodeproj/project.pbxproj` para:
  - adicionar `NativeAppleSignInPlugin.swift` e `NativeAppleSignInPlugin.m` ao grupo `App`;
  - incluir ambos no `PBXSourcesBuildPhase` do target `App`.

2) Corrigir fonte de configuração do Capacitor (para sobreviver ao sync)
- Editar `capacitor.config.ts` adicionando `packageClassList` com:
  - `CAPCameraPlugin`
  - `CAPLiveUpdatesPlugin`
  - `PurchasesPlugin`
  - `NativeAppleSignInPlugin`
- (Opcional recomendado) manter também o hook `cap-sync-after` no config raiz, já que hoje ele está só no JSON de iOS.

3) Garantir alinhamento após sync
- Rodar sequência de atualização nativa:
  1. `git pull`
  2. `npm run build`
  3. `npx cap sync ios`
  4. `node fix-signing.cjs` (se necessário no seu fluxo)
  5. Clean Build Folder + Build no Xcode

4) Verificação objetiva
- Ao tocar “Continuar com Apple”, não pode mais aparecer `UNIMPLEMENTED`.
- Fluxo esperado: abrir sheet da Apple → retornar `identityToken` → `supabase.auth.signInWithIdToken` concluir login.

5) Fallback (se ainda falhar após o passo 4)
- Aplicar estratégia oficial do Capacitor v8 para plugin local:
  - criar `ViewController` custom herdando `CAPBridgeViewController`;
  - em `capacitorDidLoad()`, chamar `bridge?.registerPluginInstance(NativeAppleSignInPlugin())`;
  - atualizar `Main.storyboard` para usar essa controller.
- Esse fallback elimina dependência exclusiva de descoberta via `packageClassList`.

Detalhes técnicos (resumo):
- Arquivos envolvidos:  
  - `ios/App/App.xcodeproj/project.pbxproj`  
  - `capacitor.config.ts`  
  - `ios/App/App/capacitor.config.json` (gerado/sincronizado)  
  - `ios/App/App/NativeAppleSignInPlugin.swift`  
  - `ios/App/App/NativeAppleSignInPlugin.m`
- Resposta à sua dúvida: **sim, neste caso vale rodar `cap sync ios`**, mas só depois de corrigir o config raiz e a integração no target iOS; senão o problema pode persistir.
