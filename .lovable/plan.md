# Envio de token VIP por WhatsApp

## O que já se sabe
- Os registros mostram que as duas tentativas de hoje para 5583998189959 foram aceitas pela Z-API ("WhatsApp VIP message sent"). Ou seja: o app não está falhando ao enviar; a mensagem some depois que a Z-API a recebe.
- Hoje o app só confere se a Z-API respondeu "OK". Ele não guarda a resposta completa nem confere se o número tem WhatsApp. Por isso a causa exata ainda não foi confirmada.

## Causas prováveis (ainda não confirmadas)
1. O número não tem WhatsApp, ou o formato está diferente do cadastrado no WhatsApp (por exemplo, sem o 9 extra).
2. O número é o mesmo da instância da Z-API, e ela não envia mensagem para si mesma.
3. O WhatsApp segurou a mensagem por ser a primeira conversa com um link (filtro contra spam de contato novo).

## O que vou fazer
1. Investigar primeiro: consultar a Z-API para saber se o número existe no WhatsApp e ver o status da mensagem enviada.
2. Na função de envio:
   - verificar, antes de enviar, se o número tem WhatsApp e mostrar um erro claro ao administrador quando não tiver;
   - registrar o retorno da Z-API (ID da mensagem) para conseguirmos rastrear entregas.
3. Atualizar o texto da mensagem para o nome atual, "BíbliaToon Club", e trocar o link para bibliatoonclub.com.
4. Testar com o número de vocês e confirmar que a mensagem chega.

## Detalhes técnicos
- `supabase/functions/send-vip-token/index.ts`: chamar `GET /phone-exists/{phone}` antes do `send-text`, registrar `messageId`/`zaapId` com `console.log` e devolver um aviso quando `exists=false`.
- Reimplantar a função e conferir os registros dela.
