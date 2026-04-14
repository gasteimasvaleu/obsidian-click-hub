

## Plano: Suportar dois secrets no webhook do RevenueCat (iOS + Android)

### Problema
- O `REVENUECAT_WEBHOOK_SECRET` atual já funciona para o projeto iOS
- O projeto Android do RevenueCat usa um secret diferente
- A Edge Function só aceita um secret hoje

### Solução
1. **Adicionar novo secret** `REVENUECAT_WEBHOOK_SECRET_ANDROID` no Supabase com o valor `f98b03f5b63df6a307cae95f89b11ee6a7188628bb54ac2b0e93e3f9b808c54c`

2. **Atualizar a Edge Function** `revenuecat-webhook/index.ts` para aceitar qualquer um dos dois secrets:

```typescript
const expectedSecret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");
const expectedSecretAndroid = Deno.env.get("REVENUECAT_WEBHOOK_SECRET_ANDROID");

const token = authHeader?.replace("Bearer ", "");

if (!token || (token !== expectedSecret && token !== expectedSecretAndroid)) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

3. **Testar** enviando o webhook de teste novamente do RevenueCat Android

### Resultado
- iOS continua funcionando com o secret original
- Android funciona com o novo secret
- Nenhuma alteração no banco de dados

