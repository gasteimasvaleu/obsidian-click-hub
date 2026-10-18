# Corrigir o login com Apple na 1.3, que já está publicada

## Situação
A 1.3 já foi aprovada e está na App Store, e o "Continuar com Apple" não funciona nela (erro 1000). A Apple aprovou porque testou com a conta de e-mail mcpixgordo. Quem baixar ou atualizar no iPhone agora não consegue entrar com Apple. Só entra quem tem e-mail e senha.

A causa continua na assinatura do build feita pelo AppFlow, não no código.

## O que eu faço
- Mudo a versão do iPhone de **1.3 para 1.3.1** e deixo o build em 38. Como a 1.3 já foi publicada, a Apple não aceita outro build com o mesmo número de versão.

## O que você faz
1. **Confirmar a causa:** no AppFlow, em Builds, compare o perfil de assinatura do build 36 (que funcionava) com o do 37.
2. **Gerar o perfil de novo:** no site da Apple, em Profiles, abra `BibliaToonKIDS_AppStore_Final`, clique em Edit, depois Save, e baixe o arquivo.
3. **Trocar no AppFlow:** em Settings → Certificates, substitua o perfil pelo que você baixou.
4. **Testar antes de enviar:** gere o build 1.3.1 (38) e mande para o TestFlight. Teste "Continuar com Apple" lá antes de qualquer outro passo.
5. **Enviar para a revisão** e pedir **revisão acelerada** (Expedited Review) em developer.apple.com/contact/app-store/?topic=expedite, explicando que o login com Apple quebrou na versão publicada. Costuma sair em 1 dia.
6. Nas notas para a Apple, peça para testarem também o login com Apple.

## Enquanto a 1.3.1 não sai
A mensagem de erro já orienta a pessoa a usar e-mail e senha, mas quem só tem conta Apple fica sem entrar. A correção 1.3.1 precisa sair o quanto antes.

## Detalhes técnicos
- `MARKETING_VERSION` 1.3 → 1.3.1 nas configurações Debug e Release de `ios/App/App.xcodeproj/project.pbxproj`. `CURRENT_PROJECT_VERSION` fica em 38.
