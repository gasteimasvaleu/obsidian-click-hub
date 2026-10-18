# Enviar a versão 1.3.1 (build 39) para revisão da Apple

O login com Apple funcionou no build 39 pelo TestFlight. Não precisa mudar nada no app.

## Seus passos
1. No App Store Connect, abra a aba Distribuição e crie a versão **1.3.1**.
2. Na seção "Compilação", escolha **1.3.1 (39)**.
3. Nas notas da versão, escreva algo como: "Correção do login com Apple e melhorias de estabilidade."
4. Em App Review Information, confira se o login de teste (`mcpixgordo@hotmail.com`) ainda está preenchido.
5. Mantenha a China continental fora da disponibilidade.
6. Envie para revisão.

## Para as próximas versões
- Aumente só o número da versão e do build. A configuração de assinatura já está certa.
- Antes de enviar, confira o IPA com `codesign` e veja se aparece `com.apple.developer.applesignin`.
