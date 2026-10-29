# Convite VIP por WhatsApp: a pessoa digita o próprio e-mail

## Problema
Quando o convite vai só por WhatsApp, o sistema cria um e-mail provisório, como `whatsapp+558399187322@vip.local`. Ninguém consegue decorar esse e-mail para entrar depois, e o campo vem travado na tela de cadastro.

## O que vou mudar
1. **Tela de cadastro VIP:** quando o convite tiver esse e-mail provisório, o campo Email aparece vazio e liberado, com o texto "Digite seu e-mail". A pessoa usa o próprio e-mail para criar a conta e entrar depois. Convites enviados por e-mail continuam como hoje, com o campo travado.
2. **Ao criar a conta:** o sistema confere se o e-mail é válido e se ainda não pertence a outra conta. Se já existir, aparece a mensagem "Este e-mail já possui uma conta. Faça login." A conta e o acesso VIP passam a usar o e-mail digitado.
3. **Contas já criadas com o e-mail provisório:** não mexo nelas sem você pedir. Se quiser, troco o e-mail de alguma conta específica depois.

## Detalhes técnicos
- `src/pages/Cadastro.tsx`: no formulário com token, se `subscriberData.email` terminar com `@vip.local`, o input fica editável e obrigatório, e o `email` é enviado no corpo da ação `complete`.
- `supabase/functions/complete-signup/index.ts`: na ação `complete`, se o e-mail do assinante for `@vip.local`, exige um `body.email` válido (regex e minúsculas), confere se já existe em `subscribers` ou se o Auth retorna "already registered", cria o usuário com esse e-mail e atualiza `subscribers.email`. A validação passa a retornar a flag `needsEmail`.
- Reimplantar `complete-signup`.
