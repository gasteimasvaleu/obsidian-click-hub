

# Correcao de Code Signing - CODE_SIGNING_ALLOWED

## Resumo

Aplicar as alteracoes em 3 arquivos para resolver o conflito de assinatura do RevenueCat SPM no Appflow:

## Alteracoes

### 1. `ios/App/App.xcodeproj/project.pbxproj`

- **Remover** `CODE_SIGNING_ALLOWED = NO;` do bloco `attributes` do projeto (esta no lugar errado)
- **Adicionar** `CODE_SIGNING_ALLOWED = NO;` nas buildSettings das configs globais do projeto (Debug e Release) -- faz SPM/Pods ignorarem signing
- **Adicionar** `CODE_SIGNING_ALLOWED = YES;` nas buildSettings das configs do App target (Debug e Release) -- permite que so o App assine

### 2. `fix-signing.cjs`

- Atualizar o script para injetar `CODE_SIGNING_ALLOWED` automaticamente:
  - App target (detectado via `PRODUCT_BUNDLE_IDENTIFIER`): `CODE_SIGNING_ALLOWED = YES;`
  - Outros targets: `CODE_SIGNING_ALLOWED = NO;`
- Remover `CODE_SIGNING_ALLOWED` do bloco `attributes` caso presente

### 3. `ios/App/Gymfile`

- Simplificar xcargs para apenas `DEVELOPMENT_TEAM=CASJQDDA7L` (sem tentar anular CODE_SIGN_IDENTITY, pois Appflow sobrescreve)

## Resultado esperado

Apos o push, voce puxa com `git pull` e faz novo build no Appflow. O RevenueCat SPM vai ignorar a identidade global injetada pelo Appflow porque herda `CODE_SIGNING_ALLOWED = NO` do projeto.

