# Envio às lojas (sem mudanças no projeto)

Da última vez, o problema não foi o envio em si: o IPA saiu **sem a permissão do "Iniciar sessão com Apple"**, e o login da Apple dava erro (1000). Antes de enviar, confira isso.

## iPhone (Appflow + Transporter)
1. Gere o build no Appflow (versão 1.4, build 40) e baixe o IPA.
2. No Terminal, na pasta onde está o IPA (troque o nome do arquivo):
```
unzip -q -o App.ipa && codesign -d --entitlements - Payload/App.app
```
3. Confira se aparecem **com.apple.developer.applesignin** e **aps-environment = production**.
   - Se aparecerem: envie pelo Transporter.
   - Se não aparecerem: não envie; me mande um print.
4. No Transporter, se o envio travar ou falhar, me mande um print do erro (o mais comum é número de build repetido).
5. No App Store Connect: escolha o build 40 na versão 1.4 e envie para revisão.

## Android
Android Studio > Build > Generate Signed App Bundle (versão 2.3.0, código 10) e envie o AAB no Google Play Console.
