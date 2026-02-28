

## Corrigir conflito de assinatura do RevenueCat SPM

### Problema
O RevenueCat (pacote SPM) e automaticamente assinado, mas o Gymfile esta forcando a identidade "Apple Distribution" globalmente via `DEVELOPMENT_TEAM`. Isso causa conflito porque targets SPM nao aceitam assinatura manual com certificado de distribuicao.

### Solucao
Atualizar o `ios/App/Gymfile` para incluir `CODE_SIGN_IDENTITY=` (vazio) e `CODE_SIGN_STYLE=Automatic` nos xcargs. Isso permite que:
- O App target use as configuracoes manuais definidas no projeto Xcode
- Os targets SPM (RevenueCat) herdem assinatura automatica sem conflito

### Arquivo modificado
- `ios/App/Gymfile` -- alterar a linha xcargs de:
  ```
  xcargs "DEVELOPMENT_TEAM=CASJQDDA7L"
  ```
  para:
  ```
  xcargs "DEVELOPMENT_TEAM=CASJQDDA7L CODE_SIGN_IDENTITY= CODE_SIGN_STYLE=Automatic"
  ```
  O resto do arquivo permanece igual.

### Por que funciona
Passar `CODE_SIGN_IDENTITY=` (vazio) como argumento global do xcodebuild remove a identidade manual dos targets que nao tem override explicito (como RevenueCat). O `CODE_SIGN_STYLE=Automatic` permite que o Xcode resolva a assinatura automaticamente para esses targets. O App target continua usando suas configuracoes manuais definidas no `project.pbxproj`.

### Apos a correcao
Fazer commit, push e iniciar novo build no Appflow.
