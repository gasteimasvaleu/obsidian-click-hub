
# Alterar URL do Botão "Assine Agora" para Teste

## Mudança

**Arquivo:** `src/pages/Login.tsx` — linha 11

**De:**
```typescript
const HOTMART_URL = "https://pay.hotmart.com/L103253261E";
```

**Para:**
```typescript
const HOTMART_URL = "https://google.com";
```

Apenas essa constante precisa ser alterada. O botão já referencia `HOTMART_URL` corretamente.
