# Liberar "Continuar com Google" no app Android

## O que está acontecendo
O código atual já deixa o botão do Google sempre ativo — não existe mais nenhum bloqueio esperando assinatura. O app da Play Store (versão 2.2.2) ainda está mostrando a tela antiga, embutida no build, porque a atualização ao vivo não chegou ou não foi aplicada no Android.

## Passos
1. **Teste rápido no celular:** abra o app, espere uns 30 segundos com internet, feche por completo (tire dos apps recentes) e abra de novo. Repita 2 vezes. A atualização só aparece depois que o app é reaberto.
2. **Conferir no AppFlow:** no último deploy para o canal "Production", veja se o Android não ficou de fora por limite de versão nativa (campos "Min/Max/Equivalent native version"). Se tiver versão mínima definida acima de 2.2.2, ou só versões do iOS, o Android é ignorado.
3. **Se ainda não aparecer:** fazemos um novo build Android (versão 2.2.3, código 8) com a tela atual já embutida e enviamos para a Play Store. Eu preparo o projeto; o build e o envio são feitos por você no AppFlow/Android Studio.
4. **Proteção extra (opcional):** um aviso discreto que verifica atualização ao abrir e aplica na hora, em vez de esperar o próximo reinício.

## Detalhes técnicos
- `Login.tsx`: botão Google só tem `disabled={isGoogleSigningIn}`.
- Android já tem `@capacitor/live-updates` instalado; versionCode 7 / versionName 2.2.2 em `android/app/build.gradle`.
- O passo 3 aumenta versionCode/versionName; o passo 4 usa `LiveUpdates.sync()` + `reload()` ao iniciar no ambiente nativo.
