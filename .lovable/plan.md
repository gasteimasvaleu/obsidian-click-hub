## Login com Apple de liviafrade@icloud.com: o que aconteceu

### O que foi verificado
- A conta Apple liviafrade@icloud.com entra no app com o e-mail oculto **nc79b9qkwy@privaterelay.appleid.com**.
- Essa conta Apple já tem uma **assinatura paga e ativa até 14/10/2026** (compra real pela App Store, transação 160003251054192).
- Logins de hoje:
  - 11:26: login com a conta antiga.
  - 11:34: a conta foi **excluída** (opção "Excluir conta" do app).
  - 11:34: novo login com a Apple criou uma conta nova com o mesmo e-mail.
- O registro da assinatura continua ativo, mas ficou **sem vínculo** com a conta nova.

### Conclusão
Não é uma falha. O app não pediu pagamento porque essa conta Apple já é assinante. A Apple reconhece a assinatura em qualquer celular onde a pessoa entre com o mesmo Apple ID.

### O que proponho
1. Ligar de novo o registro da assinatura à conta nova, para manter tudo consistente (painel, relatórios, renovação).
2. Para testar a tela de pagamento, use um Apple ID que nunca assinou ou uma conta de teste (Sandbox) da Apple.

### Detalhes técnicos
- Atualizar `subscribers.user_id` para `a17ef814-d7eb-4197-ba7a-4d824056b122` onde o e-mail é `nc79b9qkwy@privaterelay.appleid.com`.
- Opcional: na exclusão de conta, apagar ou desvincular o registro em `subscribers` de forma consistente, e no login vincular de novo pelo e-mail ou pelo `transaction_id`.
