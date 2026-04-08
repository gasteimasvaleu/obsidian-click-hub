

# Ajustar Product ID por plataforma (iOS vs Android)

## O que muda
Uma única alteração mínima no arquivo `src/lib/revenuecat.ts`: trocar a constante fixa `PRODUCT_ID` por uma função que retorna o ID correto conforme a plataforma.

## Detalhes técnicos

**Arquivo:** `src/lib/revenuecat.ts`

- Remover: `const PRODUCT_ID = 'BIBLIATOONKIDS2';`
- Adicionar: função `getProductId()` que retorna `'BIBLIATOONKIDS2'` no iOS e `'bibliatoonkids2'` no Android
- Atualizar a única referência ao `PRODUCT_ID` na função `purchaseMonthly` para usar `getProductId()`

**Nenhuma outra alteração.** O comportamento no iOS permanece 100% idêntico — a função simplesmente retorna o mesmo valor que já existia (`BIBLIATOONKIDS2`). Apenas no Android o valor muda para minúsculo, como exigido pelo Google Play.

## Escopo
- 1 arquivo, ~3 linhas alteradas
- Zero impacto no fluxo iOS

