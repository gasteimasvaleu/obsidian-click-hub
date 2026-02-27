

# Corrigir erro de signing do RevenueCat SPM no Appflow

## O Problema Real

O `DEVELOPMENT_TEAM` que adicionamos no `project.pbxproj` so se aplica aos targets do **seu** projeto (`App`). Pacotes SPM como o RevenueCat sao resolvidos pelo Xcode em `DerivedData/SourcePackages/` e criam seus **proprios** projetos Xcode separados -- eles **nao herdam** as configuracoes do seu pbxproj.

A unica forma de forcar o `DEVELOPMENT_TEAM` em **todos** os targets (incluindo SPM) e passa-lo como argumento de linha de comando do `xcodebuild`. Quando passado assim, ele sobrescreve as configuracoes de todos os targets, incluindo os pacotes SPM.

## Solucao

Criar um arquivo `Gymfile` na pasta `ios/App/` que o fastlane (usado internamente pelo Appflow) vai detectar automaticamente. Esse arquivo passa `DEVELOPMENT_TEAM` como `xcargs`, forcando o valor em todos os targets.

## Alteracoes

### 1. Criar `ios/App/Gymfile`

```ruby
xcargs "DEVELOPMENT_TEAM=CASJQDDA7L"
```

Isso faz o fastlane gym passar `DEVELOPMENT_TEAM=CASJQDDA7L` como argumento do `xcodebuild`, que se aplica a **todos** os targets incluindo pacotes SPM como RevenueCat.

### 2. Alternativa: Configuracao no Appflow

Se o Gymfile nao for detectado pelo Appflow, a alternativa e configurar diretamente no painel do Appflow:

- Acesse **Build > iOS > Build Configuration**
- No campo **Build Arguments** ou **Custom xcargs**, adicione: `DEVELOPMENT_TEAM=CASJQDDA7L`

Essa configuracao faz exatamente a mesma coisa que o Gymfile.

### 3. Manter as alteracoes anteriores no pbxproj

As configuracoes de `DEVELOPMENT_TEAM` que ja adicionamos no pbxproj continuam uteis para builds locais no Xcode. Nao vamos remove-las.

## Arquivos

| Arquivo | Alteracao |
|---------|-----------|
| `ios/App/Gymfile` | Novo - passa DEVELOPMENT_TEAM como xcargs do xcodebuild |

## Por que as tentativas anteriores nao funcionaram

- **pbxproj project-level settings**: so afetam targets dentro do seu projeto, nao pacotes SPM resolvidos externamente
- **build.xcconfig**: mesma limitacao -- xcconfig files sao vinculados ao seu projeto, nao aos projetos SPM em DerivedData
- **fix-signing.cjs**: modifica apenas o seu pbxproj, nao os projetos SPM

A solucao de `xcargs` na linha de comando e a unica que funciona porque o `xcodebuild` aplica argumentos CLI como override global em **todos** os targets do workspace.

