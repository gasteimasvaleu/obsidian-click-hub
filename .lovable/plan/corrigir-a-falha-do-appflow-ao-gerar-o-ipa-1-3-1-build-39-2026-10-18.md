# Corrigir a falha do AppFlow ao gerar o IPA (1.3.1 / build 39)

## O que aconteceu
O registro mostra que o build falhou porque a configuração que adicionei para forçar o "Iniciar sessão com Apple" foi aplicada a **todas** as partes do app, incluindo bibliotecas de terceiros (RevenueCat, Google Sign-In etc.). Cada uma delas passou a procurar um arquivo de permissões `App/App.entitlements` dentro da própria pasta, não encontrou e o build parou ("ARCHIVE FAILED").

Ou seja: o erro foi causado pela minha alteração anterior, não pelo seu certificado ou perfil.

## O que vou fazer
1. No arquivo de configuração do build iOS usado pelo AppFlow, remover a linha que força assinatura/permissões para todas as partes do app. Assim o arquivo de permissões volta a valer **somente para o app principal**, onde ele realmente existe.
2. Manter a parte que define, na exportação do IPA, o perfil `BibliaToonKIDS_AppStore_Final`, o certificado Apple Distribution e o time `CASJQDDA7L`.
3. Conferir que o app principal (versão Release) continua apontando para o arquivo de permissões que contém "Iniciar sessão com Apple" e notificações, com assinatura manual e o mesmo perfil.
4. Manter versão 1.3.1 / build 39 (a 39 nunca chegou à Apple, então pode ser reutilizada).

## O que você faz depois
1. Gerar novamente o build iOS no AppFlow (1.3.1 / 39).
2. Antes de enviar pelo Transporter, verificar o IPA com o mesmo comando de antes:
   `codesign -d --entitlements - Payload/App.app`
3. O resultado precisa conter `com.apple.developer.applesignin`. Se aparecer, envie e teste no TestFlight.
4. Se o build passar mas a permissão continuar faltando, o próximo passo é gerar o IPA pelo Xcode no seu Mac (Product → Archive), que respeita o arquivo de permissões com certeza.

## Detalhes técnicos
- Causa: `xcargs` em `ios/App/Gymfile` passa `CODE_SIGN_ENTITLEMENTS=App/App.entitlements` (e `PROVISIONING_PROFILE_SPECIFIER`, `CODE_SIGN_STYLE`, `CODE_SIGN_IDENTITY`) como override global do `xcodebuild`, aplicado a todos os targets de Swift Package (AppAuth, GTMAppAuth, GoogleSignIn, GoogleUtilities, Promises, GTMSessionFetcher, RevenueCat). O caminho relativo é resolvido em cada pacote e o arquivo não existe.
- Correção: remover `xcargs` do Gymfile; manter `export_method`, `skip_profile_detection` e `export_options` (signingStyle manual, provisioningProfiles para `com.bibliatoonkids.app`, signingCertificate, teamID).
- Target App (Debug/Release) em `project.pbxproj` já define `CODE_SIGN_ENTITLEMENTS = App/App.entitlements`, `CODE_SIGN_STYLE = Manual`, `DEVELOPMENT_TEAM = CASJQDDA7L` e `PROVISIONING_PROFILE_SPECIFIER[sdk=iphoneos*] = BibliaToonKIDS_AppStore_Final`; apenas corrigir a indentação da linha `CURRENT_PROJECT_VERSION = 39` no bloco Debug.
- `App.entitlements` contém `aps-environment=production` e `com.apple.developer.applesignin=[Default]`; sem alterações.
