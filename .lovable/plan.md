# Login com Apple: causa encontrada no jeito como o AppFlow monta o app

## O que os prints mostraram
- O perfil da Apple está certo: o login com Apple aparece em Capabilities, e o certificado é o mesmo cadastrado no AppFlow.
- Mesmo assim, o arquivo do app (.ipa) saiu sem nenhuma permissão: nem o login com Apple, nem as notificações. Então o perfil não é o problema. O que se perde é o arquivo de permissões do app, durante a montagem.

## Causa provável
O projeto tem um arquivo de instruções que o AppFlow lê na hora de montar o app. Ele manda montar o app **com a assinatura em branco**. Quando o app é montado sem assinatura, o Xcode joga fora o arquivo de permissões. Depois o AppFlow assina com o perfil, mas as permissões já sumiram. É exatamente o resultado que o seu teste mostrou.

Ainda não sei por que a 1.2 funcionava com essa mesma instrução. Talvez o AppFlow tenha mudado a forma de montar. Por isso o teste no Mac continua sendo a prova final, antes de enviar.

## O que eu faço
- Corrijo essa instrução: o app passa a ser montado já assinado com o certificado de distribuição e o perfil `BibliaToonKIDS_AppStore_Final`. Assim as permissões entram no app.
- Subo o build de 38 para **39**, porque o 38 já foi enviado. A versão continua 1.3.1.

## O que você faz
1. Gere um novo build iOS no AppFlow a partir do commit mais novo. Ele deve sair como 1.3.1 (39).
2. **Antes de enviar**, repita o teste no Mac com o novo .ipa:
   ```
   rm -rf ~/Downloads/ipa-check && mkdir ~/Downloads/ipa-check && cd ~/Downloads/ipa-check
   unzip -q "/caminho/do/novo.ipa"
   codesign -d --entitlements - Payload/App.app
   ```
   Agora precisa aparecer `com.apple.developer.applesignin`.
3. Só se aparecer: envie pelo Transporter, teste no TestFlight e mande para revisão acelerada.

## Plano B, se o AppFlow ignorar a correção
Monte pelo Xcode no Mac, que respeita o arquivo de permissões:
- `npm run sync:ios`, abrir `ios/App/App.xcworkspace`, Product → Archive → Distribute App → App Store Connect.
- Eu te passo o passo a passo detalhado se for preciso.

## Detalhes técnicos
- `ios/App/Gymfile`: `xcargs` hoje passa `CODE_SIGN_IDENTITY=` (vazio), o que gera um archive sem entitlements. Trocar por `CODE_SIGN_IDENTITY="Apple Distribution" PROVISIONING_PROFILE_SPECIFIER="BibliaToonKIDS_AppStore_Final" DEVELOPMENT_TEAM=CASJQDDA7L CODE_SIGN_STYLE=Manual`.
- `project.pbxproj`, configuração Release: `DEVELOPMENT_TEAM` vazio → `CASJQDDA7L`, e `CODE_SIGN_IDENTITY` → `Apple Distribution`.
- `CURRENT_PROJECT_VERSION` 38 → 39 em Debug e Release.
