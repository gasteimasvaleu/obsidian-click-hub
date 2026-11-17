# Gerar o AAB mais rápido (sem mudar nada no app)

## O que está acontecendo
Na sua tela, o Android Studio abriu a pasta **Desktop inteira** (aparece "Desktop" no topo e "Scanning module 'Desktop'"). Por isso ele está lendo todos os seus projetos (Monetisex, PIX Gordo etc.) antes de começar. O AAB nem começou a ser gerado.

## Passo a passo
1. No Android Studio: **File > Close Project**.
2. Na tela inicial, clique em **Open** e escolha somente a pasta:
   `Desktop / Projetos Bibliatoon Club / BibliaToon Club APP / android`
   (ou rode `npx cap open android` no terminal, dentro da pasta do app).
3. Espere a barra de baixo terminar o **Gradle Sync** (a primeira vez leva alguns minutos; depois fica rápido).
4. **Build > Generate Signed App Bundle or APK**, keystore `novakey.jks`, **release**, Create.
5. O arquivo sai em `android/app/release/app-release.aab`.

## Se ainda ficar lento
- Feche o Chrome e outros apps pesados.
- Não clique em "Invalidate Caches" sem necessidade (força tudo de novo).

Nenhuma alteração no código do app é necessária.
