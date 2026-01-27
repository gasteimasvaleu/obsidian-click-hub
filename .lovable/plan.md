

## Adicionar Coluna de Expiração de Assinatura

### Contexto

A Hotmart envia o campo `purchase.date_next_charge` nos webhooks de compra, que indica a data da próxima cobrança. Para assinaturas mensais, isso funciona como a data de expiração do período atual - após essa data, se o pagamento não for renovado, o usuário perde acesso.

### Alterações Necessárias

#### 1. Migração de Banco de Dados

Adicionar nova coluna na tabela `subscribers`:

```sql
ALTER TABLE subscribers
ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN subscribers.subscription_expires_at IS 
  'Data de expiração da assinatura (próxima cobrança da Hotmart)';
```

#### 2. Atualizar Edge Function `hotmart-webhook`

**Arquivo:** `supabase/functions/hotmart-webhook/index.ts`

**2.1 Atualizar interface TypeScript:**

Adicionar o campo `date_next_charge` na interface de purchase:

```typescript
purchase: {
  transaction: string;
  date_next_charge?: number;  // timestamp em milissegundos
  offer?: {
    code: string;
  };
};
```

**2.2 Processar a data no código:**

Converter o timestamp de milissegundos para ISO string e salvar:

```typescript
// Converter date_next_charge (milissegundos) para Date
const subscriptionExpiresAt = purchase.date_next_charge 
  ? new Date(purchase.date_next_charge).toISOString() 
  : null;
```

**2.3 Atualizar INSERT e UPDATE statements:**

Incluir `subscription_expires_at` em todos os locais onde o subscriber é criado ou atualizado:

- Renovação de assinatura ativa (linha ~70)
- Reativação de assinatura cancelada (linha ~93)
- Criação de novo subscriber (linha ~127)

### Lógica de Funcionamento

| Evento | Ação com subscription_expires_at |
|--------|----------------------------------|
| PURCHASE_COMPLETE | Salva date_next_charge como subscription_expires_at |
| PURCHASE_APPROVED | Salva date_next_charge como subscription_expires_at |
| Renovação (status active) | Atualiza subscription_expires_at com nova data |
| SUBSCRIPTION_CANCELLATION | Mantém a data atual (usuário tem acesso até expirar) |

### Uso Futuro

Com esta coluna, você poderá:
- Exibir ao usuário quando sua assinatura expira
- Implementar lógica de bloqueio automático após expiração
- Enviar lembretes antes da renovação
- Verificar status real de acesso (mesmo após cancelamento, usuário tem acesso até a data de expiração)

### Atualizar Registro Existente

Após implementar, podemos atualizar o registro do `direitaquevence@hotmail.com` com a data de expiração correta baseada na compra de hoje.

