

# Plano: Criar script `sync:ios` padronizado

## Problema
Não existe um comando `sync:ios` no `package.json`. O fluxo iOS atual depende de rodar comandos separados manualmente, o que pode causar esquecimentos (ex: não rodar `fix-signing.cjs` após o sync).

## O que muda

### 1. Adicionar script `sync:ios` no `package.json`
```
"sync:ios": "npm run build && npx cap sync ios && cd ios/App && pod install && cd ../.. && node fix-signing.cjs"
```

Isso garante a ordem correta:
- Build web → Sync Capacitor → Pod install → Fix assinatura

### 2. Nenhuma outra alteração
- Não mexe em arquivos iOS nativos
- Não altera `fix-signing.cjs`
- Não altera `sync:android`

## Segurança
O `cap sync ios` **não sobrescreve** arquivos customizados como `NativeAppleSignInPlugin`, `AppDelegate.swift`, `Info.plist` ou `App.entitlements`. Apenas atualiza web assets em `public/` e dependências de plugins.

## Resultado
Você passa a usar `npm run sync:ios` como fluxo único e seguro, igual ao `npm run sync:android`.

