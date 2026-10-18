# Corrigir o login com Apple na 1.3 e tirar o aviso da tela de login

## 1. Login com Apple quebrado na 1.3, que já está publicada
A Apple aprovou a 1.3 porque testou com a conta de e-mail mcpixgordo. Quem baixar ou atualizar no iPhone agora não consegue entrar com Apple (erro 1000). A causa está na assinatura do build feita pelo AppFlow, não no código.

**O que eu faço:** mudo a versão do iPhone de **1.3 para 1.3.1** e deixo o build em 38. A Apple não aceita outro build com o número 1.3, porque essa versão já foi publicada.

**O que você faz:**
1. No AppFlow, em Builds, compare o perfil de assinatura do build 36 (que funcionava) com o do 37.
2. No site da Apple, em Profiles, abra `BibliaToonKIDS_AppStore_Final`, clique em Edit, depois Save, e baixe o arquivo.
3. No AppFlow, em Settings → Certificates, substitua o perfil pelo que você baixou.
4. Gere o build 1.3.1 (38), mande para o TestFlight e teste "Continuar com Apple" antes de qualquer outro passo.
5. Envie para a revisão e peça **revisão acelerada** (Expedited Review) em developer.apple.com/contact/app-store/?topic=expedite. Nas notas, peça para a Apple testar também o login com Apple.

## 2. Aviso "Você precisa estar logado para acessar esta página"
Esse aviso não tem relação com o erro da Apple. Ele aparece quando o app abre sem ninguém logado e manda a pessoa para a tela de login. Na tela de login, ele só confunde.

**O que eu faço:** a pessoa sem login continua indo para a tela de login, mas sem esse aviso. O aviso "Você não tem permissão" das telas de administrador continua. Essa mudança chega pelo live update, sem nova versão na loja.

## Detalhes técnicos
- `ios/App/App.xcodeproj/project.pbxproj`: `MARKETING_VERSION` 1.3 → 1.3.1 nas configurações Debug e Release. `CURRENT_PROJECT_VERSION` fica em 38.
- `src/components/admin/ProtectedRoute.tsx`: remover `toast.error` no caso `!user` e usar `navigate('/login', { replace: true })`.
