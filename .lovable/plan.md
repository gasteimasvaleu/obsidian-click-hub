
## Remoção do Alerta de Plataforma Externa

### Contexto
O card de alerta na página de login menciona uma "plataforma externa" que não existe mais, então deve ser removido para evitar confusão.

---

### Mudanças Necessárias

**Arquivo:** `src/pages/Login.tsx`

1. **Remover o componente Alert** (linhas 82-88)
   - Excluir todo o bloco `<Alert>` que contém a mensagem sobre cadastro independente

2. **Limpar imports não utilizados** (linha 9-10)
   - Remover `Alert` e `AlertDescription` dos imports
   - Remover `Info` do lucide-react (se não for usado em outro lugar)

---

### Código a Remover

```tsx
// Remover import (linha 9):
import { Alert, AlertDescription } from '@/components/ui/alert';

// Remover import do ícone Info (linha 10):
import { Info } from 'lucide-react';

// Remover todo este bloco (linhas 82-88):
<Alert className="mt-4 border-primary/30 bg-primary/5">
  <Info className="h-4 w-4 text-primary" />
  <AlertDescription className="text-xs text-muted-foreground ml-2">
    <strong className="text-primary">Atenção:</strong> Este cadastro é independente da plataforma externa. 
    Mesmo que você já tenha login na plataforma, será necessário criar uma nova conta aqui para acessar o app.
  </AlertDescription>
</Alert>
```

---

### Resultado

A página de login ficará mais limpa, contendo apenas:
- Título e descrição de boas-vindas
- Botão "Limpar sessão"
- Tabs de login/cadastro
