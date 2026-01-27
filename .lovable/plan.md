
## Atualizar Remetente do Email para Domínio Próprio

### Mudança Necessária

Atualizar o endereço de email do remetente na edge function `hotmart-webhook` para usar o domínio configurado no Resend.

### Alteração

**Arquivo:** `supabase/functions/hotmart-webhook/index.ts`

| Campo | Valor Atual | Novo Valor |
|-------|-------------|------------|
| Remetente | `Biblia Toon Kids <noreply@bibliatoonkids.com.br>` | `Biblia Toon Kids <bibliatoonkids@bibliatoonkids.com>` |

### Código

Linha 200 será alterada de:
```typescript
from: "Biblia Toon Kids <noreply@bibliatoonkids.com.br>",
```

Para:
```typescript
from: "Biblia Toon Kids <bibliatoonkids@bibliatoonkids.com>",
```

### Resultado

Os emails de cadastro serão enviados a partir do seu domínio próprio verificado no Resend, garantindo melhor entregabilidade e profissionalismo.
