# Mostrar "Continuar com Google" no login web (desktop)

## Contexto
Na tela de login, o botão "Continuar com Apple" aparece em tudo que não é Android (incluindo o navegador), e o "Continuar com Google" só aparece no app Android (`platform === 'android'`). No desktop, por isso, só a Apple aparece. O usuário confirmou que quer o Google também no navegador web.

## O que mudar

1. **`src/pages/Login.tsx`** — remover a condição de plataforma do botão Google: ele passa a aparecer em qualquer plataforma (web, iOS e Android). O clique já tem os dois caminhos prontos:
   - Nativo → `nativeGoogleSignIn()` (igual hoje no Android);
   - Web → `supabase.auth.signInWithOAuth({ provider: 'google' })` (código de fallback já existente, só estava escondido).

2. **Verificação web (após a mudança)** — no preview, conferir que:
   - Apple e Google aparecem juntos no desktop;
   - Clicar em Google no navegador inicia o redirecionamento OAuth (ou mostra erro claro se o provedor Google não estiver configurado para web no Supabase — nesse caso, avisar o usuário sobre a configuração necessária no Console do Google Cloud / Supabase Auth).

## Riscos / observações
- O login Google por navegador depende do provedor Google estar configurado com client secret no Supabase Auth e dos domínios publicados (bibliatoonclub.com, app.bibliatoonkids.com) nos redirect URLs permitidos. Se faltar isso, o botão aparece mas o fluxo falha — aí avisar o usuário o que configurar.
- Nada muda no app nativo (iOS continua sem botão Google no celular, Android igual).

## Atualização de memória
- Atualizar `mem://auth/google-sign-in-android`: o botão Google não é mais restrito ao Android — aparece também no web via OAuth.

## Validação
- Build OK nos logs.
- Preview desktop (1280px): os dois botões de login social visíveis.
