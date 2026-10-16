# Corrigir: conta sem assinatura assistindo aulas ilimitadas

## O que descobri (confirmado no banco)
O bloqueio de 3 aulas está funcionando, mas a conta do teste está sendo tratada como **assinante**:

- A conta que entrou hoje às 12:10 (pereirajose0009@gmail.com) tem uma assinatura **ativa até 15/11/2026**.
- Essa assinatura é **a mesma compra do Google Play** da conta caiorobbb@gmail.com (mesmo número de transação GPA.3368-8157-7033-02699).
- Motivo: a assinatura do Google Play / App Store pertence à **conta da loja do celular**, não à conta do app. Quando alguém entra no app nesse celular, o app hoje faz uma "Restaurar Compras" automática no login e passa a assinatura para a conta que acabou de entrar.
- Resultado: qualquer conta que entrar num celular onde já existe uma assinatura vira Premium e nunca vê o paywall. Por isso o teste deu errado.
- Também existe uma rotina antiga que, no login, pode pegar uma assinatura "sem dono" qualquer e ligar à conta que entrou. Isso também pode liberar acesso indevido.

## O que vou fazer
1. **Acabar com a "Restaurar Compras" automática no login.** A assinatura da loja só é ligada a uma conta quando a pessoa **compra** dentro do app ou toca em **"Restaurar Compras"** no paywall ou no Perfil.
2. **Remover a rotina que pega assinaturas "sem dono" aleatórias** no login.
3. **Verificar Premium só pela conta do app:** o app continua checando a loja, mas apenas a assinatura que já pertence àquela conta.
4. **Corrigir os dados do teste:** tirar o Premium da conta pereirajose0009@gmail.com (a compra é sua, da conta caiorobbb@gmail.com), para você testar o limite de 3 aulas e o paywall.

## O que você precisa fazer no RevenueCat (1 minuto)
RevenueCat → Project Settings → **Restore Behavior** → escolher **"Keep with original App User ID"** (manter com a conta original). Assim, se alguém tocar em "Restaurar Compras" com a mesma conta da loja em outra conta do app, a assinatura não é "roubada" da conta original.

## Como testar depois de publicar e fazer o live update
- Use um celular com uma conta da Play Store / Apple **que nunca assinou**, ou só confira com a conta pereirajose0009 depois da correção dos dados.
- Abra 3 aulas diferentes: todas liberam, com o aviso de aulas grátis restantes.
- Na 4ª aula nova: o paywall aparece.

## Detalhes técnicos
- `src/lib/revenuecat.ts` → `syncSubscriptionAfterLogin`: remover o fallback `restorePurchases()` e a chamada `claimOrphanSubscriber()`; só gravar em `subscribers` quando `checkSubscriptionStatus()` (depois de `identifyUser`) já disser que está ativo para esse app user. Apagar `claimOrphanSubscriber` (ele pega `orphans[0]` sem comparar a transação).
- `src/contexts/AuthContext.tsx`: manter `identifyUser` + sync no login (agora sem restore).
- `src/components/Paywall.tsx` e `Login.tsx`: "Restaurar Compras" continua manual (ação explícita).
- `src/hooks/useSubscription.ts`: sem mudança de regra (banco por user_id/e-mail + RevenueCat do usuário identificado).
- Dados: atualizar `subscribers` do user_id `336506c9-…` (pereirajose0009) para `subscription_status='expired'` e limpar `transaction_id`, para o webhook não reativar por essa compra.
- Webhook: hoje faz update por `app_user_id`; com o Restore Behavior "Keep with original", eventos TRANSFER deixam de mover a assinatura.
