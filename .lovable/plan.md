# Próximo passo: enviar o build 1.3.1 (39) e testar o login Apple

## Resultado da verificação
O IPA novo agora contém a permissão "Iniciar sessão com Apple" (`com.apple.developer.applesignin`) e a de notificações (`aps-environment`). As duas estavam faltando no IPA anterior, e é por isso que o login Apple dava o erro 1000.

Não precisa mudar nada no app. Os próximos passos são todos seus:

## Passos
1. Enviar esse IPA pelo Transporter.
2. No App Store Connect, esperar o build 1.3.1 (39) terminar de processar. Se aparecer "Missing Compliance", responda e siga.
3. No TestFlight do iPhone, instalar o build 39 e tocar em "Continuar com Apple".
4. Se o login funcionar, envie a versão 1.3.1 para revisão com o build 39.
5. Se der erro, me mande o print com o código que aparecer.

## Detalhes técnicos
- Nenhuma alteração de código. O Gymfile sem `xcargs` e o target App com `CODE_SIGN_ENTITLEMENTS = App/App.entitlements` geram o IPA certo.
- Para as próximas versões, é só aumentar o número do build. A configuração de assinatura continua como está.
