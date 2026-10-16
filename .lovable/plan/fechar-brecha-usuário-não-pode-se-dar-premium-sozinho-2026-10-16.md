# Fechar brecha: usuário não pode se dar Premium sozinho

## O que encontrei
- Hoje qualquer usuário logado pode criar ou alterar o próprio registro de assinatura. Alguém com conhecimento técnico poderia virar Premium sem pagar.
- O "Restaurar Compras" automático no login já foi removido.
- O contador de 3 aulas grátis já está protegido (o usuário não consegue apagar nem editar).

## O que vou fazer
1. **Gravar assinatura só pelo servidor.** O app só avisa "comprei" ou "restaurei". Uma função no servidor pergunta ao RevenueCat se aquele usuário tem assinatura ativa e só então grava.
2. **Usuário só lê a própria assinatura.** Criar ou alterar passa a ser feito apenas pelo servidor e pelos administradores.
3. **Proteger VIPs.** Assinaturas VIP e manuais nunca são sobrescritas por dados da loja.
4. **Mesma compra não fica em duas contas.**

## O que você faz
1. No RevenueCat: Project Settings → API Keys → criar uma **Secret API key** em cada projeto (uma da Apple, outra do Google Play). Vou abrir um campo seguro com os dois espaços para você colar.
2. Se ainda não fez: Project Settings → Restore Behavior → **"Keep with original App User ID"**.

Chega por live update, sem build nativo.

## Como testar
- Compre ou toque em "Restaurar Compras": o Premium aparece normalmente.
- Entre com outra conta no mesmo celular: ela não vira Premium sozinha.
- VIPs continuam com acesso.

## Detalhes técnicos
- Secrets `REVENUECAT_SECRET_API_KEY_IOS` e `REVENUECAT_SECRET_API_KEY_ANDROID` (pedidas via add_secret antes do código).
- Nova edge function `rc-sync`: valida JWT, recebe a plataforma (ios/android) e usa a chave correspondente; se não achar, tenta a outra. Chama `GET https://api.revenuecat.com/v1/subscribers/{user_id}`, verifica entitlement ativo, grava com service role; ignora registros `product_source='vip'`.
- `src/lib/revenuecat.ts`: `syncSubscriptionAfterLogin` passa a chamar `supabase.functions.invoke('rc-sync')`; Paywall usa o mesmo caminho após compra/restauração.
- `AuthContext.tsx`: sync só no evento `SIGNED_IN`.
- `WhatsAppOptinSection.tsx`: opt-in/telefone hoje atualizam `subscribers` pelo cliente; mover para RPC `SECURITY DEFINER` que altera só `whatsapp_optin`, `whatsapp_optin_at` e `phone` do próprio usuário.
- Migration: remover políticas "Users can update own subscription" e "Users can upsert own subscription"; índice único parcial em `transaction_id`.
- `revenuecat-webhook`: não sobrescrever registros `vip`.
