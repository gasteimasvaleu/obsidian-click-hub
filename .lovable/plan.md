## Tornar o app freemium (só Cursos pagos)

### O que muda para o usuário
- **Tela de login:** fica só com "Continuar com Apple" (iPhone) / "Continuar com Google" (Android) e e-mail/senha — sem exigir assinatura antes. Os botões "Assinar com App Store / Google Play" saem dessa tela.
- **Tudo grátis**, exceto **Cursos e vídeos** (página Cursos, cursos, módulos e aulas).
- **Paywall em tela cheia:** ao abrir Cursos sem assinatura, aparece uma tela com benefícios, nome do plano, preço (vindo da loja), botão **Assinar**, **Restaurar Compras**, Termos e Privacidade (exigências da Apple).
- Assinantes ativos e VIPs entram direto nos Cursos.
- No Perfil, um atalho "Seja Premium" para quem não assina.

### Detalhes técnicos
- `Login.tsx`: remover gate `hasPurchased` dos botões Apple/Google, remover restore silencioso no mount e o bloco de compra; manter links legais.
- Novo hook `useSubscription`: considera ativo se `subscribers` (por user_id/email) tem `subscription_status='active'` e não expirado (cobre VIP/Hotmart) OU RevenueCat `checkSubscriptionStatus()` ativo no nativo.
- Novo componente `PremiumGate` + `Paywall` (tela cheia): usa `purchaseMonthly`, `restorePurchases`, e após compra chama `syncSubscriptionAfterLogin` com o usuário logado (assim a assinatura já nasce ligada à conta, eliminando os registros "órfãos").
- Envolver rotas `/plataforma`, `/plataforma/curso/:id`, `/plataforma/modulo/:id`, `/plataforma/aula/:id` em `App.tsx` com `PremiumGate`.
- Preço exibido via `Purchases.getOfferings()` (`priceString`), com o `ParentalGate` antes da compra, como já é regra.
- Atualizar memórias: fluxo "compra antes do login" deixa de valer; registrar regra freemium (só Cursos pagos).

### Atenção
- Exige novo build nativo (iOS e Android) e nova revisão nas lojas. Na revisão, informar à Apple que o app agora é freemium com compra dentro do app.
