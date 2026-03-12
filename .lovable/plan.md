

## Registrar NativeAppleSignInPlugin no Capacitor

### Problema
O erro `{"code":"UNIMPLEMENTED"}` ocorre porque o plugin nativo `NativeAppleSignInPlugin` não está registrado na lista de plugins do Capacitor. O Capacitor precisa saber quais classes de plugin carregar.

### Solução
Adicionar `NativeAppleSignInPlugin` ao `packageClassList` no `ios/App/App/capacitor.config.json`.

### Alteração

**`ios/App/App/capacitor.config.json`** - Adicionar `"NativeAppleSignInPlugin"` ao array `packageClassList`:
```json
"packageClassList": [
  "CAPCameraPlugin",
  "CAPLiveUpdatesPlugin",
  "PurchasesPlugin",
  "NativeAppleSignInPlugin"
]
```

### Pós-implementação
Como é uma mudança no config nativo do iOS, o usuário precisa:
1. `git pull`
2. Rebuild no Xcode (não precisa de `cap sync` pois o arquivo já está no projeto iOS)

