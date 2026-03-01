

## Corrigir padding da pagina Index

### Problema
1. **Topo**: O primeiro card (video) fica atras da navbar fixa. O `pt-12` atual nao eh suficiente para compensar a altura da navbar + safe-area-inset-top.
2. **Inferior**: O menu tubelight aparece cortado porque o `pb-24` nao eh suficiente para o menu + safe-area-inset-bottom.

### Solucao
Ajustar apenas o padding do container principal em `src/pages/Index.tsx`:

- **Padding superior**: Trocar `pt-12` (do wrapper do video) para algo maior como `pt-20`, garantindo que o conteudo comece abaixo da navbar fixa.
- **Padding inferior**: Trocar `pb-24` para `pb-32` ou `pb-36`, garantindo espaco suficiente para o menu tubelight + safe area.

### Alteracoes

**Arquivo: `src/pages/Index.tsx`**
- Linha 59: Alterar `pb-24` para `pb-36` no container principal
- Linha 62: Alterar `pt-12` para `pt-20` no wrapper do video

Apenas 2 valores de classe CSS serao modificados, sem alterar navbar nem menu.
