

## Adicionar Logs Detalhados para Diagnosticar Erro de Compra

### Problema
A compra via App Store falha com "Erro ao processar a compra", mas o codigo atual esconde o erro real. Precisamos ver exatamente onde e por que esta falhando.

### Alteracoes

**Arquivo: `src/lib/revenuecat.ts`**

Adicionar logs detalhados em cada etapa da funcao `purchaseMonthly` para identificar o ponto exato da falha:

1. **Antes de buscar offerings**: Log confirmando que o SDK foi importado
2. **Apos buscar offerings**: Log mostrando o conteudo retornado (quantidade de pacotes, IDs dos produtos)
3. **No erro "Nenhum plano disponivel"**: Log detalhado do objeto `offerings` completo
4. **No pacote selecionado**: Log do pacote que sera usado na compra
5. **No catch**: Incluir `error?.code`, `error?.message`, `error?.underlyingErrorMessage` e o objeto completo `JSON.stringify(error)` no console.error
6. **Retornar erro detalhado**: Mostrar o codigo e mensagem real do erro no toast para facilitar o diagnostico

**Arquivo: `src/pages/Login.tsx`**

Alterar o `handleAppStorePurchase` para exibir o erro detalhado no toast em vez da mensagem generica, permitindo ver no iPhone qual erro exato esta ocorrendo.

### Resultado Esperado
Ao tentar a compra novamente no iPhone, o toast mostrara o erro real (ex: "Product not found", "Store problem", "Network error", etc.), permitindo corrigir a causa raiz.

### Possiveis Causas Comuns
- Offering "default" sem pacote vinculado no dashboard do RevenueCat
- Produto `BIBLIATOONKIDS2` nao vinculado ao pacote no RevenueCat
- App Store Connect Agreements (contratos de Paid Apps) nao finalizados
- Bundle ID do app diferente do configurado no RevenueCat

