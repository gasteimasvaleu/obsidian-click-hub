
Objetivo: resolver de forma definitiva o `{"code":"UNIMPLEMENTED"}` no “Continuar com Apple” no iOS.

Diagnóstico atual (com base no código + docs oficiais do Capacitor v8):
- `NativeAppleSignInPlugin.swift/.m` existem e estão no target.
- `packageClassList` também está configurado.
- Mesmo assim, o runtime retorna `UNIMPLEMENTED`, o que indica que o bridge não está expondo o plugin no momento da execução.
- As mensagens `UIScene lifecycle...` e `sandbox extension...` não são a causa desse erro.
- Do I know what the issue is? **Yes**: o plugin local está dependendo de auto-registro/configuração e precisa de **registro explícito no `CAPBridgeViewController`** (abordagem oficial para código nativo local), além de validação de binário/cache.

Arquivos críticos isolados:
- `ios/App/App/Base.lproj/Main.storyboard`
- `ios/App/App.xcodeproj/project.pbxproj`
- `ios/App/App/NativeAppleSignInPlugin.swift`
- `src/lib/native-apple-signin.ts`
- `src/pages/Login.tsx`
- `ios/App/App/App.entitlements` (para etapa seguinte de autorização Apple)

Plano de implementação:
1) Registro explícito do plugin no bridge (fix principal)
- Criar `ios/App/App/MyViewController.swift` herdando `CAPBridgeViewController`.
- Em `capacitorDidLoad()`, registrar: `bridge?.registerPluginInstance(NativeAppleSignInPlugin())`.
- Adicionar log nativo de confirmação de registro.

2) Trocar controller no storyboard
- Em `Main.storyboard`, substituir `CAPBridgeViewController` por `MyViewController` na cena principal.
- Garantir `customModule` correto.

3) Garantir compilação do novo controller
- Atualizar `project.pbxproj` para incluir `MyViewController.swift` no grupo `App` e no `PBXSourcesBuildPhase`.

4) Instrumentação mínima no front para diagnóstico final
- Em `native-apple-signin.ts`/`Login.tsx`, logar `Capacitor.isPluginAvailable('NativeAppleSignIn')` antes de chamar `authorize()`.
- Se `false`, exibir erro amigável indicando plugin nativo indisponível (em vez de erro genérico).

5) Verificação de capability Apple (evitar próximo bloqueio após sair do UNIMPLEMENTED)
- Revisar `App.entitlements` para incluir capability de Sign in with Apple (`com.apple.developer.applesignin`).
- Isso não explica o UNIMPLEMENTED, mas evita falha na etapa seguinte quando o plugin já estiver respondendo.

Validação (ordem obrigatória):
1. `git pull`
2. `npm run build`
3. `npx cap sync ios`
4. `node fix-signing.cjs`
5. Xcode: Clean Build Folder + apagar app do dispositivo + Build/Run
6. Teste E2E: tocar “Continuar com Apple” e confirmar:
   - log de registro do plugin no startup,
   - `isPluginAvailable = true`,
   - abertura do sheet da Apple,
   - retorno de `identityToken`,
   - `supabase.auth.signInWithIdToken` concluindo login.

Fallback se ainda persistir:
- Confirmar que está rodando binário gerado no Xcode (não App Store/TestFlight antigo).  
- Com Live Updates, JS atualiza; plugin nativo **não**. Se o binário instalado for antigo, continuará `UNIMPLEMENTED` até instalar build nativo novo.
