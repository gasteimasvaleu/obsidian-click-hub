## Tornar o app freemium (só Cursos pagos)

### O que muda para o usuário
- **Tela de login:** fica só com "Continuar com Apple" (iPhone) / "Continuar com Google" (Android) e e-mail/senha — sem exigir assinatura antes. Os botões "Assinar com App Store / Google Play" saem dessa tela.
- **Tudo grátis**, exceto as **aulas em vídeo dos Cursos**.
- **3 aulas grátis por conta:** o usuário navega livremente pelos cursos e módulos e pode assistir 3 aulas diferentes. Rever uma aula já liberada não conta de novo.
- **Paywall em tela cheia:** ao abrir a 4ª aula nova sem assinatura, aparece uma tela com benefícios, nome do plano, preço (vindo da loja), botão **Assinar**, **Restaurar Compras**, Termos e Privacidade (exigências da Apple). Um aviso discreto mostra quantas aulas grátis ainda restam.
- Assinantes ativos e VIPs assistem tudo, sem limite.
- No Perfil, um atalho "Seja Premium" para quem não assina.

### Detalhes técnicos
- `Login.tsx`: remover gate `hasPurchased` dos botões Apple/Google, remover restore silencioso no mount e o bloco de compra; manter links legais.
- Novo hook `useSubscription`: considera ativo se `subscribers` (por user_id/email) tem `subscription_status='active'` e não expirado (cobre VIP/Hotmart) OU RevenueCat `checkSubscriptionStatus()` ativo no nativo.
- Nova tabela `free_lesson_views` (user_id, lesson_id, created_at, único por par) com RLS: usuário lê/insere só os próprios. Contagem no banco evita burlar reinstalando o app.
- Na página de aula: se não assinante e a aula não está na lista do usuário, verificar se já tem 3; se sim, mostrar `Paywall`; senão registrar a aula e liberar.
- Novo componente `Paywall` (tela cheia): usa `purchaseMonthly`, `restorePurchases`, e após compra chama `syncSubscriptionAfterLogin` com o usuário logado (assim a assinatura já nasce ligada à conta, eliminando os registros "órfãos").
- Preço exibido via `Purchases.getOfferings()` (`priceString`), com o `ParentalGate` antes da compra, como já é regra.
- Atualizar memórias: fluxo "compra antes do login" deixa de valer; registrar regra freemium (só Cursos pagos).

### Atenção
- Nenhuma mudança nativa: tecnicamente pode ir por atualização ao vivo.
- Recomendado: enviar para revisão nas lojas mesmo assim, porque mudar o modelo de venda e a tela de compra sem revisão vai contra as regras da Apple (2.5.2 / 3.3.2) e pode tirar o app da loja. Na revisão, avisar que o app agora é freemium com compra dentro do app.
