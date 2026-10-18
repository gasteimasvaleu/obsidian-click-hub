# Corrigir "Erro ao fazer login com Apple" no iPhone

## O que já conferi
- A parte do iPhone está montada: o botão nativo da Apple, a permissão "Sign in with Apple" e a tela que carrega esse botão estão no projeto.
- O servidor de login não registrou nenhuma tentativa com Apple hoje. Ou seja, o erro acontece **no celular, antes de chegar ao servidor**, ou o servidor recusa sem deixar registro.
- Hoje o app esconde o motivo real: qualquer falha vira a mesma mensagem "Erro ao fazer login com Apple". Por isso ainda não dá para cravar a causa.

## O que vou fazer
1. **Mostrar o motivo real do erro** na mensagem (ex.: "botão da Apple não disponível nesta versão", "token recusado pelo servidor"). Chega por live update, sem nova versão na loja.
2. **Conferir no Supabase** se o login Apple está ligado e se o identificador do app (`com.bibliatoonkids.app`) está cadastrado como permitido. Se faltar, eu corrijo ou te mostro exatamente onde clicar.
3. Com a mensagem real em mãos (você testa de novo e me manda o print), aplico a correção certa:
   - Se for "botão não disponível": o build novo (1.3 / 37) saiu sem a peça nativa da Apple — ajusto e você gera outro build.
   - Se for recusa do servidor: corrijo a configuração do Apple no Supabase, sem novo build.

## Enquanto isso
A conta de teste da Apple (mcpixgordo@hotmail.com) entra por e-mail e senha, então a revisão da Apple não fica travada por esse erro.

## Detalhes técnicos
- `src/pages/Login.tsx` `handleAppleSignIn`: no `catch`, exibir `error.message`/`error.code`; no erro de `signInWithIdToken`, já exibe a mensagem.
- Verificar config Auth do provider Apple (enabled, client_ids contendo `com.bibliatoonkids.app`).
- Possível causa nativa: plugin registrado em duplicidade (`.m` com `CAP_PLUGIN` + `CAPBridgedPlugin` + `registerPluginInstance`) — revisar se a mensagem indicar plugin indisponível.
