

## Problema

O App Store Connect rejeitou o upload porque `CURRENT_PROJECT_VERSION = 28` já existe. Cada upload precisa de um build number único e maior que o anterior.

## Plano

Incrementar `CURRENT_PROJECT_VERSION` de **28** para **29** no arquivo `ios/App/App.xcodeproj/project.pbxproj` (duas ocorrências: Debug e Release).

Após a alteração, basta rodar o build novamente no Appflow.

