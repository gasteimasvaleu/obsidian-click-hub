

# Padronizar telefone com +55 automaticamente

## Problema
O telefone e salvo no banco sem o codigo do pais. Dependendo de onde o usuario cadastra, o formato varia (com ou sem 55).

## Pontos de salvamento identificados

Existem 4 locais onde o telefone e salvo na tabela `subscribers`:

| Local | Arquivo |
|-------|---------|
| WhatsApp opt-in (perfil) | `src/components/profile/WhatsAppOptinSection.tsx` |
| Cadastro via token | `supabase/functions/complete-signup/index.ts` |
| Cadastro admin | `supabase/functions/admin-create-user/index.ts` |
| Webhook Hotmart | `supabase/functions/hotmart-webhook/index.ts` |

## Solucao

Adicionar uma funcao de normalizacao em cada ponto que limpa o telefone e adiciona o prefixo `55` antes de salvar:

```text
Entrada do usuario: (11) 99999-9999
Limpo: 11999999999
Normalizado: 5511999999999
```

### Logica de normalizacao

```
1. Remover todos os caracteres nao numericos
2. Se comecar com "+55", remover o "+"
3. Se NAO comecar com "55", adicionar "55" no inicio
4. Resultado final: apenas digitos, sempre comecando com 55
```

## Arquivos a modificar

### 1. WhatsAppOptinSection.tsx
- Na funcao `handleSavePhone`, apos limpar o telefone, verificar se comeca com `55` e adicionar se necessario

### 2. complete-signup/index.ts
- Antes de salvar o `phone` no update do subscriber, normalizar com prefixo `55`

### 3. admin-create-user/index.ts
- Antes de salvar no `subscribers.upsert`, normalizar o phone

### 4. hotmart-webhook/index.ts
- Ao receber `buyer.phone` do webhook, normalizar antes de salvar (tanto no insert quanto no update)

### 5. Indicacao visual no frontend
- Adicionar texto "+55" fixo ao lado do campo de telefone no `WhatsAppOptinSection` para o usuario saber que o codigo ja e adicionado automaticamente

## Detalhes tecnicos

Nos edge functions (Deno), criar uma funcao helper inline:

```typescript
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return '';
  return cleaned.startsWith('55') ? cleaned : '55' + cleaned;
}
```

No frontend (React), aplicar a mesma logica antes do `supabase.update()`.

Nenhuma mudanca no banco de dados e necessaria.

