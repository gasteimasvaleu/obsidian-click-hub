# Atualizar versões para novo envio

- iPhone: 1.5 (42) -> **1.6, build 43** (ios/App/App.xcodeproj/project.pbxproj, Debug e Release)
- Android: 2.3.1 (12) -> **2.3.2, código 13** (android/app/build.gradle)

Nenhuma outra mudança. Depois: baixar o projeto, rodar `npm run sync:ios` e `npm run sync:android`, gerar IPA/AAB e publicar o build Web no Appflow (canal Production).
