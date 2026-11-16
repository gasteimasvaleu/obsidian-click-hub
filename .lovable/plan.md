# Corrigir: TestFlight abre com as telas antigas

## O que está acontecendo
O app tem um sistema de "atualização ao vivo" (Ionic Appflow) ligado. Toda vez que abre, ele baixa a versão guardada no Appflow (canal "Production") e troca as telas novas que vieram no build 40 por essa versão antiga. O ícone não passa por esse sistema, por isso só ele mudou.

## O que vou fazer
1. Desligar a atualização ao vivo, para o app usar sempre as telas que vêm dentro do build enviado às lojas.
2. Subir o número do build (iPhone 1.4 build 41, Android 2.3.0 código 11), já que o build 40 está com o problema.

## O que você faz depois
- Baixar o projeto atualizado, rodar `npm run sync:ios` e `npm run sync:android`, gerar o IPA e o AAB e enviar de novo.
- No iPhone de teste: apagar o app e instalar de novo pelo TestFlight (para limpar a versão antiga baixada).

## Detalhes técnicos
- `src/main.tsx`: remover o bloco `LiveUpdates.sync()/reload()`.
- `capacitor.config.ts`: remover `plugins.LiveUpdates` e `CAPLiveUpdatesPlugin` do `packageClassList`.
- `package.json`: remover `@capacitor/live-updates`.
- Atualizar `CURRENT_PROJECT_VERSION` (iOS) e `versionCode` (Android).
