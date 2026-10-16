# Corrigir WhatsApp bloqueado (login Apple) e botão Google no iPhone

## Problema 1 — WhatsApp continua bloqueado
Causa confirmada: a assinatura da conta Apple está gravada só com o e-mail (sem o ID da conta). A regra de segurança do banco só deixa cada usuário ler a linha que tem o ID dele — então o app nem enxerga essa assinatura. O selo "Assinante Premium" funciona porque também consulta a Apple direto pelo RevenueCat.

Correção:
- Vincular agora as assinaturas sem ID ao usuário certo, comparando o e-mail (afeta g457tk7fm5@ e nc79b9qkwy@ privaterelay).
- Automático daqui pra frente: sempre que uma assinatura for criada/atualizada sem ID, o banco preenche o ID pelo e-mail do usuário. Assim o problema não volta para novos logins Apple.

## Problema 2 — Botão Google aparecendo no iPhone
Causa confirmada: na tela de login o botão Google é exibido sempre, sem checar a plataforma.

Correção: mostrar o Google só no Android e no navegador; no app do iPhone fica apenas "Continuar com Apple".

## Detalhes técnicos
- Migration: função `link_subscriber_user_id()` SECURITY DEFINER + trigger BEFORE INSERT OR UPDATE em `public.subscribers`: se `user_id` é nulo e há `auth.users` com o mesmo e-mail (case-insensitive), preenche `user_id`. Backfill único via UPDATE para as linhas existentes.
- `src/pages/Login.tsx`: envolver o bloco do Google em `platform !== 'ios'`.
- Depois: publicar e fazer live update.
