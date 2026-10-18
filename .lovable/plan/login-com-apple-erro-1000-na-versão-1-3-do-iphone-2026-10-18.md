# Login com Apple: erro 1000 na versão 1.3 do iPhone

## O que o print mostra
"AuthorizationError error 1000" é a Apple dizendo que **o app instalado não tem permissão para usar "Entrar com Apple"**. O erro acontece no próprio iPhone, antes de chegar ao nosso servidor — por isso nada aparecia no Supabase.

Conferi o histórico: entre a 1.2 (36) e a 1.3 (37) a única mudança na parte do iPhone foi o número da versão. As duas saíram do AppFlow. Então a diferença está **na assinatura do build** (certificado/perfil usado pelo AppFlow naquele build) ou no próprio iPhone — não no código. Live update não resolve.

## Testes rápidos antes (5 minutos)
1. iPhone: Ajustes → seu nome no topo. Precisa haver uma conta Apple logada.
2. AppFlow → Builds: abra o build da 1.2 (36) e o da 1.3 (37) e compare o campo **Signing certificate / profile**. Se forem diferentes, o 37 usou um perfil sem o login Apple — confirma a causa.
3. Se tiver outro iPhone com a 1.2 ainda instalada, teste lá: se a 1.2 funcionar e a 1.3 não, é a assinatura.

## O que você faz (no site da Apple e no AppFlow)
1. developer.apple.com → Certificates, Identifiers & Profiles → **Identifiers** → `com.bibliatoonkids.app` → confirme que **Sign In with Apple** está marcado. Se não estiver, marque e salve.
2. **Profiles** → abra o perfil `BibliaToonKIDS_AppStore_Final` → **Edit** → **Save/Generate** (isso recria o perfil já com a permissão) → **Download**.
3. AppFlow → Settings → Certificates → no certificado iOS de produção, troque o perfil pelo arquivo baixado.
4. Gere um novo build iOS e mande para o TestFlight. Teste "Continuar com Apple" pelo TestFlight **antes** de enviar para revisão.

## O que eu faço
- Subo o número do build do iPhone de 37 para **38** (a Apple não aceita repetir o 37).
- Troco a mensagem de erro técnica por uma amigável ("Não foi possível entrar com Apple. Tente novamente ou use e-mail e senha."), mantendo o código do erro no final para diagnóstico.

## Importante para a revisão da Apple
Se a versão 1.3 (37) já foi enviada para revisão, a Apple vai rejeitar ao testar o login Apple. Melhor cancelar essa submissão e enviar a 38 corrigida.

## Detalhes técnicos
- Erro 1000 = `ASAuthorizationError.unknown`, causado tipicamente por falta do entitlement `com.apple.developer.applesignin` no binário assinado (perfil sem a capability) ou dispositivo sem Apple ID.
- `CODE_SIGN_ENTITLEMENTS = App/App.entitlements` presente em Debug e Release; entitlements contêm `applesignin`.
- Mudanças: `CURRENT_PROJECT_VERSION` 37 → 38 em `project.pbxproj`; ajuste da mensagem no `catch` de `src/pages/Login.tsx`.
