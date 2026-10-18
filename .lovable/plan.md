# Login com Apple: gerar o build 1.3.1 com a assinatura corrigida

## Conclusão do teste
Mesmo depois de "Parar de usar" no iPhone, o login com Apple continua falhando. Então o problema não é o aparelho: o build 1.3 (37) saiu do AppFlow sem a permissão de login com Apple. Isso só se corrige com um build novo. Live update não resolve.

O projeto já está preparado como **1.3.1 (build 38)**. Não preciso mudar nenhum código.

## O que você faz

**1. Gerar o perfil de novo (site da Apple)**
- developer.apple.com → Certificates, Identifiers & Profiles → **Profiles**
- Abra `BibliaToonKIDS_AppStore_Final` → **Edit**.
- Confira que o certificado marcado é o mesmo que está no AppFlow e que, na lista de recursos (Capabilities), aparece **Sign In with Apple**.
- **Save** → **Download**.

**2. Trocar o perfil no AppFlow**
- AppFlow → Settings → Certificates → abra o certificado iOS de produção (App Store) → substitua o perfil pelo arquivo baixado → salve.
- Na tela de build, confira que o build vai usar esse certificado.

**3. Gerar e testar**
- Gere o build iOS a partir do commit mais novo. Ele deve aparecer como 1.3.1 (38).
- Mande para o TestFlight, instale e teste **"Continuar com Apple"**.

**4. Enviar para a Apple**
- Se o login funcionar: crie a versão 1.3.1 no App Store Connect, escolha o build 38 e envie.
- Peça revisão acelerada em developer.apple.com/contact/app-store/?topic=expedite, explicando que o login com Apple quebrou na versão publicada.

## Se ainda falhar no TestFlight
Me mande o print do perfil no site da Apple (a tela de Edit) e a tela de certificados do AppFlow. Aí comparo item por item.
