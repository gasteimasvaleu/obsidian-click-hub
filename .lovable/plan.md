

## Subir o menu tubelight inferior

### Problema
O menu tubelight inferior esta sendo cortado pela safe area do iOS.

### Solucao
Aumentar o `mb-2` para `mb-6` no componente `NavBar` em `src/components/ui/tubelight-navbar.tsx` (linha 46), para que o menu fique mais acima e nao seja cortado pela safe area.

### Alteracao
**Arquivo: `src/components/ui/tubelight-navbar.tsx`**
- Linha 46: Trocar `mb-2` por `mb-6` na classe do container fixo do menu.

