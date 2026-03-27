

## Adicionar validação de Authorization Header no webhook RevenueCat

### Problema
O endpoint `revenuecat-webhook` está aberto — qualquer pessoa com a URL pode enviar eventos falsos.

### Solução
1. **Criar secret `REVENUECAT_WEBHOOK_SECRET`** via ferramenta de secrets
2. **Adicionar validação no início da função** `supabase/functions/revenuecat-webhook/index.ts`

### Alteração técnica

**Arquivo:** `supabase/functions/revenuecat-webhook/index.ts`

Após o bloco OPTIONS, antes do `try`, adicionar validação do header `Authorization: Bearer <secret>`:

```typescript
const authHeader = req.headers.get("Authorization");
const expectedSecret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");

if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

### Configuração no RevenueCat Dashboard
Após implementar, o usuário precisará configurar o mesmo secret como Authorization Header no painel do RevenueCat em **Project Settings → Webhooks → Authorization Header**.

