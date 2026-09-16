# Teste de envio do devocional pelo WhatsApp

Disparar agora, manualmente, o mesmo envio que acontece todo dia às 06:00.

## Situação atual (verificada)

- O devocional de hoje já existe e está disponível — o envio tem conteúdo para mandar.
- Hoje há **1 destinatário** na lista (assinante ativo, com telefone e com o aviso de WhatsApp ligado). Ou seja, o teste envia 1 mensagem real.

## O que vou fazer

1. Chamar a rotina de envio diário manualmente (a mesma do horário automático).
2. Ler o resultado: quantas mensagens saíram, quantas falharam e o motivo de cada falha.
3. Se a Z-API recusar (instância desconectada, telefone inválido, token), te mostro a mensagem exata do erro em português e o que precisa ser ajustado.

Nada no app ou na programação diária é alterado — é só um disparo extra agora.

## Detalhes técnicos

- Invocar `send-daily-devotional-whatsapp` via curl da edge function.
- A função busca o devocional de `daily_devotionals` da data de hoje (America/Sao_Paulo), lista `subscribers` com `whatsapp_optin = true` e `subscription_status = 'active'`, e envia via `https://api.z-api.io/instances/{ZAPI_INSTANCE}/token/{ZAPI_TOKEN}/send-text` com header `Client-Token`.
- Resposta esperada: `{ total, sent, failed, errors? }` — reportar esses números e erros.
