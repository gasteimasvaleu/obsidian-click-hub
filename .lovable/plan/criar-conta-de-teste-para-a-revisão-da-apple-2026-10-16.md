# Criar conta de teste para a revisão da Apple

## O que será feito
- Criar a conta **mcpixgordo@hotmail.com** com a senha informada, já com o e-mail confirmado. Assim a Apple entra direto, sem precisar abrir nenhum e-mail.
- Nome no perfil: "Apple Review".
- A conta fica **sem assinatura**, igual a um usuário novo: entra de graça, assiste 3 aulas e na 4ª aparece a tela de assinatura. A Apple testa a compra no ambiente de testes dela (sandbox).
- Depois de criar, confiro que o login com e-mail e senha funciona.

## O que você faz no App Store Connect
Em App Review Information → Sign-in required, preencha esse e-mail e essa senha. Nas notas, escreva: "Login gratuito. 3 aulas grátis; a assinatura é pedida a partir da 4ª aula."

## Detalhes técnicos
- Criar o usuário pela API admin do Supabase (e-mail confirmado), usando uma chamada temporária pelo servidor; os gatilhos já existentes criam o perfil e o progresso automaticamente.
- Não criar registro em `subscribers` (não ganha Premium).
- Se preferir que a conta tenha Premium liberado, é só avisar antes de aprovar.
