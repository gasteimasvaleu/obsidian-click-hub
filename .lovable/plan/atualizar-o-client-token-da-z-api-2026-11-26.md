# Atualizar o Client Token da Z-API

## O que muda
O token de segurança da conta (Client Token) foi trocado no painel da Z-API. O app precisa usar o novo valor para continuar enviando o devocional diário e os tokens VIP pelo WhatsApp.

## Passos
1. Abrir o formulário seguro para você colar o novo Client Token (o valor não passa pelo chat).
2. Enviar uma mensagem de teste para um número seu, para confirmar que o envio voltou a funcionar.

## Detalhes técnicos
- Atualizar o segredo `ZAPI_CLIENT_TOKEN` com `secrets--update_secret` (placeholder: Client Token em Z-API → Segurança).
- `ZAPI_INSTANCE` e `ZAPI_TOKEN` continuam iguais; se também mudaram, atualizar no mesmo formulário.
- Sem mudança de código: as Edge Functions leem o segredo a cada execução. Validar com uma chamada de teste à função de envio e conferir os logs.
