## Login com Apple de liviafrade@icloud.com entrou sem pagar

### O que foi verificado
- Nenhuma conta nova foi criada hoje: o cadastro mais recente é de 24/09.
- Quando alguém entra com a Apple escolhendo "ocultar meu e-mail", o app recebe um e-mail @privaterelay.appleid.com, não o @icloud.com. Por isso a busca por liviafrade@icloud.com não achou nada.
- Existe uma conta Apple "Usuário Apple" (nc79b9qkwy@privaterelay...) com **assinatura ativa até 14/10/2026** (compra real pela App Store, transação 160003251054192).

### Diagnóstico mais provável (ainda não confirmado)
Esse Apple ID já tinha assinado antes. Ao entrar com a Apple, o app reconheceu a conta e a assinatura ativa e liberou o acesso. É o comportamento esperado, não uma falha. A assinatura de quem usa a mesma conta Apple vale em qualquer celular.

### Passos
1. Confirmar o vínculo: comparar o registro de login da Apple de hoje (horário do teste) com a conta nc79b9qkwy e com o RevenueCat (ID da transação).
2. Se for essa conta: nada a corrigir. Para testar a tela de pagamento, use outro Apple ID que nunca assinou, ou uma conta de teste (Sandbox) da Apple.
3. Se NÃO for essa conta (o acesso foi liberado sem assinatura): revisar a verificação de assinatura na tela de login (`src/pages/Login.tsx`, `src/lib/revenuecat.ts`) e bloquear a entrada até a assinatura ser confirmada, mostrando a tela de compra.

### Detalhes técnicos
- Consultar `auth.users` (last_sign_in_at, raw_user_meta_data) e `auth.identities` provider `apple` perto das 11:00 UTC de hoje.
- Revisar o fluxo de restaurar compras no carregamento da tela, que libera o login com a Apple quando encontra um entitlement ativo.
