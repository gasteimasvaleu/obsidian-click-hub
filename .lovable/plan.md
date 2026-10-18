# Testar o login Apple no build 1.3.1 (39) pelo TestFlight

## Situação
- Seu print foi tirado no app baixado da **App Store**, que ainda é a versão 1.3 (build 37). Essa versão não tem a permissão do login Apple, então o código 1000 ali era esperado.
- O TestFlight já mostra o **1.3.1 (39)** disponível. Esse é o primeiro build em que a permissão aparece no IPA, como vimos no resultado do `codesign`.
- O painel mostra que o último build instalado pelo TestFlight no seu iPhone foi o 1.0 (28), em março. Ou seja, o 39 ainda não foi testado.

Não precisa mudar nada no app.

## Passos para testar
1. No iPhone, abra o app **TestFlight** (ícone azul, não a App Store). Entre com a mesma conta Apple de `caiorobbb@gmail.com`.
2. Toque em BíbliaToon CLUB, procure **1.3.1 (39)** em "Versões anteriores/Compilações" e toque em **Instalar**. Isso substitui o app da App Store.
3. Para conferir a versão, abra o TestFlight: ele mostra "1.3.1 (39)" embaixo do nome do app.
4. Abra o app e toque em "Continuar com Apple".
5. Se funcionar: no App Store Connect, aba Distribuição, crie a versão 1.3.1, escolha o build 39 e envie para revisão.
6. Se ainda der o código 1000: me mande o print e eu sigo para o próximo passo (gerar pelo Xcode no Mac).

## Detalhes técnicos
- Builds 37 e 38: o IPA não tinha `com.apple.developer.applesignin`, então dão erro 1000.
- Build 39: o IPA tem `com.apple.developer.applesignin` e `aps-environment`, como mostrou o `codesign`.
