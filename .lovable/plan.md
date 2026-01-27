

## Ajuste para Assinatura Recorrente - Não Enviar Email nas Renovações

### Problema Identificado

O código atual já possui uma verificação para não enviar email se o status for `active`. Porém, nas renovações mensais da Hotmart:

1. O código ainda gera um novo token desnecessariamente
2. A lógica pode ser simplificada para maior clareza
3. Precisamos garantir que renovações sejam apenas "silenciosas" - apenas atualizando a data de atualização

### Solução

Modificar a edge function `hotmart-webhook` para:

1. **Primeiro cadastro** (subscriber não existe): Criar registro + gerar token + enviar email
2. **Renovação** (subscriber existe e status `active`): Apenas atualizar `updated_at` e dados da transação, **sem gerar token** e **sem enviar email**
3. **Reativação** (subscriber existe mas status `cancelled/expired`): Gerar novo token + enviar email

### Mudanças no Código

**Arquivo:** `supabase/functions/hotmart-webhook/index.ts`

```typescript
// Lógica para subscriber existente (linhas 67-94)
if (existingSubscriber) {
  // Se já está ativo, é uma RENOVAÇÃO - não fazer nada além de atualizar timestamp
  if (existingSubscriber.subscription_status === "active") {
    const { error: updateError } = await supabase
      .from("subscribers")
      .update({
        hotmart_transaction_id: purchase.transaction,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingSubscriber.id);

    if (updateError) {
      console.error("Error updating subscriber on renewal:", updateError);
      throw updateError;
    }

    console.log("Renewal processed for active subscriber:", buyer.email);
    return new Response(
      JSON.stringify({ success: true, message: "Renewal processed - no email sent" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // Se status é cancelled/expired/pending, reativar com novo token
  const signupToken = generateToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  const { error: updateError } = await supabase
    .from("subscribers")
    .update({
      full_name: buyer.name,
      phone: buyer.phone || null,
      hotmart_transaction_id: purchase.transaction,
      hotmart_product_id: purchase.product.id,
      hotmart_offer_id: purchase.offer?.code || null,
      subscription_status: "pending",
      signup_token: signupToken,
      signup_token_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", existingSubscriber.id);

  if (updateError) {
    console.error("Error updating subscriber:", updateError);
    throw updateError;
  }

  await sendSignupEmail(buyer.email, buyer.name, signupToken);
  console.log("Reactivation email sent to:", buyer.email);
}
```

### Fluxo Resumido

| Cenário | Ação | Email |
|---------|------|-------|
| Novo assinante | Criar registro + token | ✅ Envia |
| Renovação mensal (status `active`) | Apenas atualiza `updated_at` | ❌ Não envia |
| Reativação após cancelamento | Gerar novo token | ✅ Envia |
| Reativação após expiração | Gerar novo token | ✅ Envia |

### Benefícios

- **Evita spam**: Usuários ativos não recebem emails repetidos todo mês
- **Mantém rastreabilidade**: O campo `updated_at` é atualizado em cada renovação
- **Permite reativação**: Se o usuário cancelar e voltar a assinar, receberá um novo email de cadastro (caso não tenha completado antes)

### Detalhes Técnicos

- A geração do token é movida para **dentro** do bloco condicional, evitando processamento desnecessário
- Adicionado log específico para renovações: `"Renewal processed for active subscriber"`
- Return antecipado para renovações, melhorando a clareza do código

