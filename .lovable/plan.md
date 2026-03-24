

## Ajuste fino do padding inferior do chat

### Correção
**Arquivo:** `src/components/ChatInterface.tsx` (linha 190)

Aumentar de `5rem` para `5.5rem`:

```
paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)"
```

