

## Corrigir fluxo pós-compra App Store

### Problema
Após compra bem-sucedida via App Store, o usuário é redirecionado para `/cadastro?source=revenuecat` onde precisa preencher email e senha manualmente. Isso é redundante e foi motivo de rejeição, pois o usuário deveria simplesmente usar "Continuar com Apple" para criar a conta.

### Fluxo correto
1. Usuário clica "App Store" → compra via RevenueCat
2. Compra bem-sucedida → permanece na tela de login com mensagem de sucesso
3. Usuário clica "Continuar com Apple" → conta criada via OAuth
4. Webhook do RevenueCat vincula a assinatura ao user ID

### Alterações

**`src/pages/Login.tsx`**
- Remover o `navigate('/cadastro?source=revenuecat')` do `handleAppStorePurchase`
- Após compra bem-sucedida, mostrar um toast orientando o usuário a clicar em "Continuar com Apple" para criar a conta
- Texto: "Assinatura realizada! Agora toque em 'Continuar com Apple' para criar sua conta."

Essa é uma alteração de 1 linha -- trocar o `navigate(...)` por um `toast.success(...)` com a mensagem correta.

