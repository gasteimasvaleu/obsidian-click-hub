

## Problema

O botão "Continuar com Apple" está condicionado ao estado `hasPurchased`, que começa como `false` e só muda para `true` após uma nova compra na mesma sessão. Após logout, o estado reseta e o botão fica desabilitado permanentemente, mesmo com assinatura ativa.

## Solução

No `Login.tsx`, ao montar o componente em plataforma nativa, chamar `restorePurchases()` automaticamente para verificar se já existe assinatura ativa. Se sim, setar `hasPurchased = true` e habilitar o botão Apple.

## Mudanças

**`src/pages/Login.tsx`**
- Adicionar `useEffect` que roda no mount (apenas em plataforma nativa)
- Chama `restorePurchases()` silenciosamente (sem toasts)
- Se `result.isActive === true`, seta `hasPurchased(true)`
- Isso desbloqueia o botão "Continuar com Apple" automaticamente

```typescript
useEffect(() => {
  if (isNativePlatform()) {
    restorePurchases().then((result) => {
      if (result.success && result.isActive) {
        setHasPurchased(true);
      }
    }).catch(() => {});
  }
}, []);
```

Mudança mínima — apenas um `useEffect` adicionado. Sem impacto no fluxo de nova compra.

