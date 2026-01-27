

## Correção do Webhook Hotmart - Estrutura do Payload

### Problema Identificado

O código atual espera que o produto esteja em `payload.data.purchase.product`, mas a Hotmart envia o produto em `payload.data.product` (no nível raiz de `data`).

**Erro registrado nos logs:**
```
TypeError: Cannot read properties of undefined (reading 'id')
at hotmart-webhook/index.ts:96:46
```

### Estrutura Real do Payload Hotmart

Com base no webhook recebido:
```json
{
  "data": {
    "product": {
      "id": 6754817,
      "name": "BíbliaToon KIDS"
    },
    "purchase": {
      "transaction": "HP3059023753",
      "offer": {
        "code": "vqlbmkzk"
      }
    },
    "buyer": {
      "email": "direitaquevence@hotmail.com",
      "name": "CAIO FIGUEIREDO ROBERTO"
    }
  }
}
```

### Alterações Necessárias

**Arquivo:** `supabase/functions/hotmart-webhook/index.ts`

**1. Atualizar a interface TypeScript (linhas 11-30):**

Corrigir a estrutura para refletir o payload real:

```typescript
interface HotmartWebhookPayload {
  event: string;
  data: {
    buyer: {
      email: string;
      name: string;
      phone?: string;
      checkout_phone?: string;
    };
    product: {
      id: number;
      name: string;
    };
    purchase: {
      transaction: string;
      offer?: {
        code: string;
      };
    };
  };
}
```

**2. Atualizar desestruturação do payload (linha 55):**

```typescript
// De:
const { buyer, purchase } = payload.data;

// Para:
const { buyer, purchase, product } = payload.data;
```

**3. Corrigir referências ao product.id:**

- **Linha 98:** `purchase.product.id` → `String(product.id)`
- **Linha 133:** `purchase.product.id` → `String(product.id)`

O `id` da Hotmart é um número, então precisamos converter para string.

### Resumo das Mudanças

| Local | Antes | Depois |
|-------|-------|--------|
| Interface | `purchase.product.id` | `product.id` no nível raiz |
| Linha 55 | `{ buyer, purchase }` | `{ buyer, purchase, product }` |
| Linha 98 | `purchase.product.id` | `String(product.id)` |
| Linha 133 | `purchase.product.id` | `String(product.id)` |

### Após o Deploy

Depois de corrigir e fazer deploy, será necessário:
1. Reprocessar a compra de `direitaquevence@hotmail.com` manualmente, ou
2. Solicitar que a Hotmart reenvie o webhook para essa transação

