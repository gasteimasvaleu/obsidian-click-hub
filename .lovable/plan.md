# Aviso do Google Cloud: cliente OAuth "Bibliatoonclub[web]" inativo

## O que o aviso diz

Nas capturas, o Google Cloud mostra um alerta no cliente **Bibliatoonclub[web]** (ID `135684784512-u67o...`):

> "Este cliente OAuth não foi usado. Clientes OAuth inativos que não sejam usados por 6 meses poderão ser excluídos."

O cliente **Android** (`135684784512-nt1j...`) está sem alerta.

## Diagnóstico

- O prazo real é **6 meses de inatividade**, não 30 dias.
- Esse cliente web **está em uso**: ele é o `webClientId` do plugin de login nativo no Android (`src/lib/native-google-signin.ts`) e também atende o login Google via navegador (configurado no Supabase).
- Os logins de hoje (computador e Android) **contam como uso** e zeram o contador de inatividade.
- O painel do Google Cloud **demora dias para atualizar** esse status — por isso o alerta ainda aparece mesmo após os logins de hoje.

## Ação proposta

Nenhuma mudança de código e nenhuma ação urgente:

1. **Não excluir** nenhum dos dois clientes OAuth — os dois são necessários (web: navegador + plugin Android; Android: app nativo).
2. Aguardar alguns dias: com os logins de hoje registrados, o alerta deve sumir sozinho.
3. Se o alerta persistir por mais de ~2 semanas mesmo com logins acontecendo, fazer um login de teste com Google no navegador (bibliatoonclub.com) para forçar uso do cliente web e re-verificar.
4. Lembrete permanente: nunca excluir o projeto `135684784512` nem essas credenciais — o botão "Continuar com Google" depende delas.

## Validação

Reabrir a página de credenciais do Google Cloud em alguns dias e confirmar que o alerta do cliente web desapareceu.
