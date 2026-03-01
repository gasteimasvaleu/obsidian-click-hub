

## Corrigir Build Script que Falha no CI

### Problema
O script `build` no `package.json` executa `pod install` como parte do processo, mas o ambiente de CI do Appflow nao tem CocoaPods instalado, causando o erro `sh: 1: pod: not found` (exit code 127).

O build do Vite completa com sucesso - a falha e apenas no `pod install`.

### Solucao

**Arquivo: `package.json`**

Separar o script de build em dois:
- `build`: apenas `tsc && vite build` (usado pelo CI/Appflow e pelo Lovable)
- `build:ios`: `tsc && vite build && cd ios/App && pod install && cd ../.. && node fix-signing.cjs` (usado localmente quando for fazer build iOS)

Alterar a linha 8:
```json
"build": "tsc && vite build",
"build:ios": "tsc && vite build && cd ios/App && pod install && cd ../.. && node fix-signing.cjs",
```

### Resultado
O build no Appflow passara sem erros, pois usara apenas `npm run build` que agora nao inclui `pod install`. Quando precisar fazer build iOS local, use `npm run build:ios`.

### Nota
O `fix-signing.cjs` tambem e removido do build padrao pois so e relevante para builds iOS. O hook `cap-sync-after` no `capacitor.config.json` ja executa `fix-signing.cjs` automaticamente quando `npx cap sync` e rodado.
