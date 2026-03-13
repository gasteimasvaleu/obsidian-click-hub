
Objetivo: corrigir o erro de upload da Apple aumentando o número de build (“versão do pacote”) para 35.

Plano de implementação:
1) Confirmar e atualizar os números de build:
- `ios/App/App.xcodeproj/project.pbxproj`
  - `CURRENT_PROJECT_VERSION = 34;` → `35;` (2 ocorrências: Debug e Release)
- `android/app/build.gradle`
  - `versionCode 34` → `35`

2) Manter a versão pública como está:
- `MARKETING_VERSION = 1.1` (iOS) permanece igual
- `versionName "1.1"` (Android) permanece igual

3) Validação rápida no código:
- Buscar novamente por `CURRENT_PROJECT_VERSION = 34` e `versionCode 34` para garantir que não ficou nenhuma ocorrência.

4) Procedimento de envio (para evitar reaproveitar IPA antigo):
- No Xcode: `Product > Clean Build Folder`
- Gerar novo `Archive`
- Enviar o novo archive (build 35) ao App Store Connect
- Confirmar no Organizer/App Store Connect que o build exibido é 35 antes de anexar à versão 1.1.

Detalhes técnicos:
- O erro da Apple indica que o `CFBundleVersion` enviado ainda estava em 34; ele precisa ser estritamente maior que o último já recebido.
- No seu projeto, `CFBundleVersion` vem de `$(CURRENT_PROJECT_VERSION)`, então trocar para 35 resolve a rejeição por número de pacote duplicado.
