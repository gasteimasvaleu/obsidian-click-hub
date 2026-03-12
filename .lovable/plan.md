

## Problema identificado

O app não possui nenhuma verificação de assinatura após o login. Qualquer usuário que faça "Continuar com Apple" (ou login com email/senha) tem acesso total ao conteúdo sem pagar.

## Opções

### Opção A — Paywall após login (recomendado para Apple)
Após o login, verificar na tabela `subscribers` se o usuário tem `subscription_status = 'active'`. Se não tiver, mostrar uma tela de paywall antes de acessar o conteúdo, com o botão de assinar via App Store.

### Opção B — Manter como está (mais simples)
Confiar que o fluxo visual guia o usuário a assinar primeiro. A Apple pode ou não rejeitar — depende do revisor notar que dá para pular a compra.

### Opção C — Desabilitar "Continuar com Apple" até assinar
Mostrar o botão de Apple Sign-In desabilitado ou com mensagem "Assine primeiro", habilitando apenas após a compra ser detectada via RevenueCat. Isso força a ordem: comprar → criar conta.

---

## Recomendação

**Opção A** é a mais robusta e alinhada com as guidelines da Apple. Porém envolve mais trabalho (criar tela de paywall, hook de verificação de assinatura, proteger rotas).

**Opção C** é mais rápida de implementar — basta adicionar um estado local que é ativado após `purchaseMonthly()` retornar sucesso, e só então habilitar o botão "Continuar com Apple".

### Implementação da Opção C (rápida)

**`src/pages/Login.tsx`**:
- Adicionar estado `hasPurchased` (default: `false`)
- Após `purchaseMonthly()` com sucesso, setar `hasPurchased = true`
- O botão "Continuar com Apple" fica desabilitado enquanto `hasPurchased === false`, com texto explicativo tipo "Assine primeiro para criar sua conta"
- Manter o login com email/senha funcionando normalmente (para a conta de teste do revisor da Apple: reviewer@bibliataonkids.com)

**Obs**: O login email/senha precisa continuar funcionando para a conta de teste que a Apple usa na revisão.

