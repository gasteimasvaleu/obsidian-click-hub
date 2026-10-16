# Fechar de vez o acesso Premium indevido

## O que encontrei
- A conta nova `pereirajose0009@gmail.com` foi criada às 13:06 e tem **0 aulas grátis registradas**. Isso significa que o app achou que ela era assinante e nem chegou a contar as aulas.
- No banco, ela **não** tem assinatura ligada ao usuário. Quem liberou foi o próprio celular: quando o banco não confirma, o app pergunta direto ao RevenueCat no aparelho. Esse celular usa a conta Google Play que pagou a assinatura do `caiorobbb@gmail.com`, então o RevenueCat “empresta” a assinatura para qualquer conta que entrar nele.
- A verificação segura no servidor (criada na última etapa) **não foi chamada nenhuma vez** pelo celular. Isso indica que o aparelho ainda roda a versão antiga do app (o live update não chegou ou não foi publicado), que ainda restaurava compras sozinha.
- Ainda existe um registro antigo de assinatura com o e-mail `pereirajose0009@gmail.com` marcado como ativo até 15/11 (é a mesma compra do Caio, reativada às 13:01).
- O botão "Seja Premium" sumiu do Perfil pelo mesmo motivo: o app achou que a conta já era assinante.

## O que vou mudar
1. **Só o servidor decide quem é Premium.** O app deixa de perguntar ao RevenueCat no celular. Ele pede ao servidor para conferir e depois só lê o que está salvo no banco para aquela conta. Assim, uma compra feita em outra conta da loja não libera mais nada.
2. **Limpar o registro emprestado.** Marcar como expirada a assinatura ativa com o e-mail `pereirajose0009@gmail.com`, já que ela pertence à compra do Caio.
3. **Mostrar a versão no Perfil.** Colocar um texto pequeno no rodapé do Perfil (ex.: "versão 2026-10-16") para você confirmar no celular se o live update chegou antes de testar.

## O que você precisa fazer
- No RevenueCat, nos **dois** projetos (Apple e Google Play): Project Settings → General → Restore Behavior = **"Keep with original App User ID"**. Sem isso, o próprio celular Android passa a assinatura para a nova conta automaticamente.
- Publicar o live update no canal Production, fechar o app de vez e abrir de novo (até duas vezes). Conferir a versão no rodapé do Perfil.
- Testar com uma conta nova: 3 aulas liberadas, a 4ª bloqueia e o "Seja Premium" aparece no Perfil.

## Detalhes técnicos
- `src/hooks/useSubscription.ts`: remover o fallback `checkSubscriptionStatus()`. Em app nativo, chamar `rc-sync` (ele confere no servidor com as chaves secretas) e depois consultar `subscribers` só por `user_id` (RLS já limita a isso). VIP/admin continuam como estão.
- Migration de dados: `UPDATE subscribers SET subscription_status='expired' WHERE id='9ea58b99-aa2b-481b-8a3b-ec0fccaa6461'`.
- `src/lib/revenuecat.ts`: atualizar `APP_BUNDLE_VERSION` e exportá-lo; exibir em `src/pages/Profile.tsx`.
- `rc-sync` não muda; com "Keep with original App User ID", o RevenueCat não transfere a compra para outro usuário, então o servidor responde "não ativo" para a conta nova.
