

# Incrementar Build Number para 34 (iOS + Android)

Atualizar o build number de 33 para 34 em ambas as plataformas para permitir o upload de um novo build no App Store Connect.

## Arquivos a alterar

1. **`ios/App/App.xcodeproj/project.pbxproj`** — Alterar `CURRENT_PROJECT_VERSION = 33` para `34` (2 ocorrências: Debug e Release)

2. **`android/app/build.gradle`** — Alterar `versionCode 33` para `34`

Após isso, você precisará fazer Archive no Xcode e Upload to App Store Connect para o build 34 aparecer disponível na nova versão.

