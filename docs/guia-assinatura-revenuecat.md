# Guia: evitar "assinatura emprestada" (RevenueCat + Supabase)

## 1. O que fazer nos painéis (sem código)

1. **RevenueCat, em cada projeto (Apple e Google Play)**
   Project Settings → General → **Restore Behavior = "Keep with original App User ID"**.
2. **Chaves secretas**: em cada projeto do RevenueCat → API keys → crie uma **Secret API key** (v1). Cole quando o Lovable pedir:
   - `REVENUECAT_SECRET_API_KEY_IOS`
   - `REVENUECAT_SECRET_API_KEY_ANDROID`
3. **Publicar o live update** no canal Production, fechar o app de vez e abrir de novo (até duas vezes). Conferir se o número de versão do app mudou.
4. **Teste**: use um celular cuja conta da loja já assinou. Entre com uma conta **nova** do app. O certo é:
   - só o limite grátis libera (ex.: 3 aulas), o próximo bloqueia;
   - o botão de assinar aparece no Perfil.

## 2. Prompt para colar no Lovable do outro app

```
Quero uma auditoria de segurança das assinaturas (RevenueCat + Supabase).
NÃO altere nada ainda: primeiro me mande um relatório e depois um plano.

Problema que tive em outro app: um celular cuja conta Google Play/Apple já
tinha assinatura liberava Premium para QUALQUER conta nova do app
("assinatura emprestada"). Verifique, com evidências do código e do banco:

1. O app chama restorePurchases/syncPurchases automaticamente no login ou
   ao abrir? (Deve ser só pelo botão "Restaurar Compras".)
2. O app decide que o usuário é Premium lendo o RevenueCat no próprio
   celular (getCustomerInfo / entitlements) em vez de perguntar ao
   servidor? (O certo: só o servidor decide.)
3. Existe lógica que pega assinaturas "órfãs"/anônimas ou busca por e-mail/
   transação e atribui ao usuário que acabou de entrar?
4. As regras de acesso (RLS) da tabela de assinaturas deixam o usuário
   criar ou alterar a própria assinatura pelo app?
5. Existe uma Edge Function que confere no RevenueCat com chaves secretas
   (uma para Apple e uma para Google Play) e é a única que grava a
   assinatura? Se não existir, proponha criar, pedindo os secrets
   REVENUECAT_SECRET_API_KEY_IOS e REVENUECAT_SECRET_API_KEY_ANDROID.
6. O webhook do RevenueCat sobrescreve assinaturas VIP/manuais ou junta
   contas diferentes pelo número da transação?
7. O limite de conteúdo grátis é contado no banco, por usuário, e o
   usuário não consegue apagar/alterar esse contador?
8. Existe um número de versão visível no app (ex.: rodapé do Perfil) para
   confirmar que o live update chegou?
9. No banco: liste assinaturas ativas que compartilham a mesma transação
   em mais de uma conta, e contas ativas sem user_id.

Depois do relatório, proponha um plano para: Premium decidido só pelo
servidor; sem restore automático; sem atribuir assinatura órfã; sem
gravação direta pelo app; VIP protegido no webhook; versão visível no app;
limpeza dos registros emprestados. Lembre-me de configurar no RevenueCat
"Restore Behavior = Keep with original App User ID" nos dois projetos.
```

## 3. O que foi corrigido no BíbliaToon Club (referência)

- Premium decidido só pelo servidor (`rc-sync` + leitura da própria linha em `subscribers`); o app não confia no RevenueCat do celular.
- Sem restore automático; só pelo botão.
- Sem atribuir assinaturas órfãs a quem entra.
- Usuário não grava assinatura direto no banco (WhatsApp via função segura).
- Webhook não sobrescreve VIP.
- Versão visível no rodapé do Perfil.
- Registros emprestados marcados como expirados.
