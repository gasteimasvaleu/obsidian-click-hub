

## Atualizar URL do Email de Cadastro

### Mudança Necessária

Atualizar a URL base na função `sendSignupEmail` para apontar para o domínio próprio da aplicação.

### Alteração

**Arquivo:** `supabase/functions/hotmart-webhook/index.ts`

| Campo | Valor Atual | Novo Valor |
|-------|-------------|------------|
| URL Base | `https://obsidian-click-hub.lovable.app` | `https://app.bibliatoonkids.com` |

### Código

Linha 195 será alterada de:
```typescript
const appUrl = Deno.env.get("APP_URL") || "https://obsidian-click-hub.lovable.app";
```

Para:
```typescript
const appUrl = "https://app.bibliatoonkids.com";
```

### Resultado

O link no email de cadastro direcionará para:
```
https://app.bibliatoonkids.com/cadastro?token=xxxxx
```

Isso garante que os novos assinantes serão redirecionados para o domínio correto da aplicação ao clicar no botão "Completar Cadastro".

