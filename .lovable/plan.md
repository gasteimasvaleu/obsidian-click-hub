

## Incrementar versao do build para 28

### Contexto
O build anterior foi enviado com `CURRENT_PROJECT_VERSION = 27`. Para enviar um novo build ao App Store Connect, esse numero precisa ser incrementado.

### Mudanca

**Arquivo:** `ios/App/App.xcodeproj/project.pbxproj`

Alterar `CURRENT_PROJECT_VERSION` de `27` para `28` em duas ocorrencias (configuracoes Debug e Release do target App):

```
// Linha ~197 (Debug)
CURRENT_PROJECT_VERSION = 28;

// Linha ~218 (Release)  
CURRENT_PROJECT_VERSION = 28;
```

Nenhuma outra alteracao necessaria. Apos isso, basta disparar o build no Appflow.

