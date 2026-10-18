# Login com Apple ainda falha: conferir o arquivo do app antes de qualquer outra coisa

## Primeiro: confirmar que você testou o build certo
Depois do Transporter, a Apple leva de 10 a 30 minutos para liberar o build no TestFlight. O app aberto precisa ter vindo do **TestFlight**: o ícone tem um pontinho laranja ao lado do nome, e dentro do app TestFlight aparece "1.3.1 (38)". Se você testou o app da App Store, ainda é a 1.3 (37) com o problema.

## Teste definitivo no Mac (2 minutos)
Esse teste mostra se o arquivo enviado pelo Transporter tem a permissão de login com Apple. No Terminal, troque o caminho pelo do arquivo `.ipa` que você baixou do AppFlow:

```
cd ~/Downloads
rm -rf ipa-check && mkdir ipa-check && cd ipa-check
unzip -q "/caminho/para/App.ipa"
codesign -d --entitlements - Payload/App.app
```

Me mande o que aparecer.
- **Aparece `com.apple.developer.applesignin`:** o arquivo está certo e o problema está em outro lugar (configuração da Apple ou do Supabase). Aí sigo por esse caminho.
- **Não aparece:** o AppFlow continua assinando sem a permissão. O caminho mais seguro passa a ser gerar o build pelo **Xcode no Mac**: Product → Archive → Distribute → App Store Connect, com o número de build 39.

## Também me mande
- Print da tela do perfil `BibliaToonKIDS_AppStore_Final` no site da Apple (a tela de Edit, mostrando certificado e Capabilities).
- Print do certificado iOS em AppFlow → Settings → Certificates.

## O que eu faço depois
- Se for preciso um build novo, subo o número de 38 para 39.
- Se o arquivo estiver certo, investigo a configuração do login com Apple no Supabase e no site da Apple (Services ID e chave).
