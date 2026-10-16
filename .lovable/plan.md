# Novas versões para App Store e Google Play

## Objetivo
Embutir a versão atual (freemium, novo paywall, login, home nova) dentro do app instalado, para que novos usuários já vejam tudo na primeira abertura, sem depender do live update.

## O que eu altero no projeto
1. **iPhone:** versão 1.2 (build 36) → **1.3 (build 37)**.
2. **Android:** versão 2.2.3 (código 8) → **2.2.4 (código 9)**.

Nada mais muda: produto do RevenueCat, chaves e live update continuam iguais.

## O que você faz depois (no Mac, na pasta do projeto, fora do iCloud)
1. `git pull` e `npm install`
2. **Android:** `npm run sync:android` → Android Studio → Build → Generate Signed App Bundle (release) → enviar o `app-release.aab` no Play Console.
3. **iPhone:** `npm run sync:ios` → build no AppFlow (ou Xcode → Archive) → TestFlight → enviar para revisão.
4. Notas de versão sugeridas: "Novo modelo gratuito com 3 aulas grátis, assinatura direto pela loja, nova tela inicial e correções."

## Atenção na revisão da Apple
- Como o app passou de pago para freemium, atualize na App Store Connect a descrição/textos que dizem que é preciso assinar para entrar.
- Mantenha a China continental fora da disponibilidade (rejeição anterior 2.1).
- Certificados/perfis válidos até 18/02/2027 — ok para este envio.

## Detalhes técnicos
- `ios/App/App.xcodeproj/project.pbxproj`: `MARKETING_VERSION` e `CURRENT_PROJECT_VERSION` (Debug e Release).
- `android/app/build.gradle`: `versionCode 9`, `versionName "2.2.4"`.
