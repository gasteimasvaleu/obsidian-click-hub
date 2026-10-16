# Corrigir card "Devocional no WhatsApp" que nega acesso a assinante ativo

## Problema

No Perfil, o usuário vê "Assinante Premium" mas o card "Devocional no WhatsApp" mostra "Esta funcionalidade está disponível apenas para assinantes ativos."

## Causa confirmada

- O selo "Assinante Premium" usa `useSubscription`, que busca em `subscribers` por **user_id OU e-mail** e verifica a data de expiração.
- O `WhatsAppOptinSection` busca em `subscribers` **somente por user_id** e sem checar expiração.
- Consulta ao banco confirmou: há assinantes ativos (ex.: logins Apple com e-mail oculto `@privaterelay.appleid.com`) cujo registro em `subscribers` tem `user_id` vazio — só o e-mail bate. Para esses usuários, o card do WhatsApp não encontra a assinatura e mostra o aviso de bloqueio.

## Correção proposta (somente frontend, `src/components/profile/WhatsAppOptinSection.tsx`)

1. Receber também o `email` do usuário (prop nova ou via `useAuth`).
2. Na busca `fetchSubscriberData`, trocar o filtro `.eq('user_id', userId)` por `.or('user_id.eq.<id>,email.eq.<email>')` com `subscription_status = 'active'`, e considerar assinatura válida apenas se `subscription_expires_at` for nula ou futura — mesma regra do `useSubscription`.
3. Nas atualizações (`handleToggleOptin` e `handleSavePhone`), usar o mesmo filtro (user_id OU e-mail) para gravar no registro correto.
4. Manter todo o resto igual (visual, textos, formatação de telefone).

## Validação

- Consultar o banco antes/depois com um usuário afetado (e-mail privaterelay ativo sem user_id).
- No preview, confirmar que o card mostra o seletor de recebimento e o campo de telefone para assinante ativo, e o aviso apenas para quem não tem assinatura.
- Build OK.
