

## Atualizar PRODUCT_ID para BIBLIATOONKIDS2

### Problema
O Product ID no codigo (`com.bibliatoon.mensal`) nao corresponde ao produto configurado no RevenueCat (`BIBLIATOONKIDS2`).

### Mudanca

**Arquivo:** `src/lib/revenuecat.ts` (linha 5)

Alterar de:
```
const PRODUCT_ID = 'com.bibliatoon.mensal';
```

Para:
```
const PRODUCT_ID = 'BIBLIATOONKIDS2';
```

Uma unica linha. Nenhuma outra alteracao necessaria.

