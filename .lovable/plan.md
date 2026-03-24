

## Ajustar padding inferior do modal do chat para não ficar atrás da navbar

### Problema
O `paddingBottom` do wrapper interno usa apenas `env(safe-area-inset-bottom) + 0.75rem`, mas a navbar tubelight ocupa mais espaço que isso. O composer fica escondido atrás da faixa preta.

### Correção
**Arquivo:** `src/components/ChatInterface.tsx` (linha 190)

Aumentar o `paddingBottom` para incluir a altura da navbar (~70px):

```
paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 5rem)"
```

Isso empurra o card inteiro para cima, garantindo que o composer fique visível acima da navbar.

