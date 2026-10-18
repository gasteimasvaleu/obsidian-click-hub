# Descobrir por que o login com Apple parou na 1.3

## O que já sei
- O código do login com Apple é igual na 1.2 e na 1.3. Só mudou o número da versão.
- O último login com Apple que funcionou foi em 16/10, às 14h, ainda na 1.2.
- A mudança do aviso "Você precisa estar logado" já foi publicada pelo live update.

## Testes que você faz (5 minutos)
1. **iPhone:** Ajustes → seu nome → Iniciar Sessão e Segurança → Iniciar Sessão com a Apple → BíbliaToon → "Parar de usar". Abra o app e tente de novo.
2. **AppFlow:** compare o certificado e o perfil de assinatura do build 36 (1.2) com os do build 37 (1.3).
3. Se tiver, teste em outro iPhone com a 1.3.

## O que fazer com cada resultado
- **Funcionou depois de "Parar de usar":** era o aparelho. Não precisa de build novo. Eu volto a versão do iPhone para 1.3 (37) para ficar igual à que está na loja.
- **Perfis diferentes, ou não funcionou em nenhum iPhone:** é a assinatura. Gere o perfil de novo no site da Apple, troque no AppFlow, gere a 1.3.1 (38) e teste no TestFlight antes de enviar.

## Detalhes técnicos
- Não há mudança de código agora. Se o problema for o aparelho, `MARKETING_VERSION` volta para 1.3 e `CURRENT_PROJECT_VERSION` para 37 em `project.pbxproj`.
