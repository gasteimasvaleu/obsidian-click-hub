

# Corrigir erro de build e instruções para sincronizar iOS

## Correção necessária

O arquivo `supabase/functions/revenuecat-webhook/index.ts` tem um erro de TypeScript na linha 107: `'error' is of type 'unknown'`. Preciso corrigir o `catch` block para tratar o tipo corretamente.

### Alteração

No `catch` block, substituir `error.message` por uma verificação de tipo:

```typescript
} catch (error) {
    console.error("RevenueCat webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
}
```

## Sobre os comandos nativos (iOS)

Esses comandos **não podem** ser executados no Lovable. Após eu corrigir o build, você precisa rodar no seu computador:

1. `git pull` para puxar as alterações
2. `npm install`
3. `npm run build`
4. `npx cap sync ios` (a pasta `ios/` já existe no projeto)
5. `npx cap open ios` para abrir no Xcode

A pasta `ios/` já está no repositório com todas as configurações. O `cap sync` vai atualizar os arquivos nativos com o build mais recente.

## Arquivo modificado

| Arquivo | Alteração |
|---------|-----------|
| `supabase/functions/revenuecat-webhook/index.ts` | Corrigir tipo de `error` no catch block |

