

## Adicionar Aviso sobre Email no Formulário de Cadastro

### Objetivo
Adicionar um aviso informativo diretamente no formulário de cadastro (quando o token é válido) para que o usuário saiba verificar a caixa de spam caso não tenha recebido o email.

### Implementação

**Arquivo:** `src/pages/Cadastro.tsx`

**Alteração 1 - Import do ícone Mail (linha 9):**

```tsx
import { Loader2, CheckCircle, XCircle, AlertTriangle, Mail } from 'lucide-react';
```

**Alteração 2 - Adicionar aviso no formulário (estado `valid`, após linha 165):**

O aviso será adicionado logo no início do formulário, antes do campo de email:

```tsx
case 'valid':
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Novo aviso informativo */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-2">
        <p className="text-blue-400 text-sm flex items-start gap-2">
          <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            Não recebeu o email? Verifique sua caixa de <strong>spam</strong> ou <strong>lixo eletrônico</strong>.
          </span>
        </p>
      </div>
      
      {/* Campos do formulário continuam aqui... */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        ...
```

### Resultado Visual

O aviso aparecerá como uma caixa destacada em azul no topo do formulário com:
- Ícone de envelope (Mail)
- Texto: "Não recebeu o email? Verifique sua caixa de **spam** ou **lixo eletrônico**."
- Estilo suave que não compete com os campos do formulário
- Cor azul informativa (em vez de amarelo de alerta) para indicar uma dica útil

