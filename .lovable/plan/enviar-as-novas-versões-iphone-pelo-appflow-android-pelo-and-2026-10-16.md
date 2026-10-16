# Enviar as novas versões: iPhone pelo AppFlow, Android pelo Android Studio

Nada precisa ser alterado no app. O commit mais novo do GitHub já traz as versões novas: iPhone 1.3 (build 37) e Android 2.2.4 (código 9). O produto de assinatura, as chaves e o live update continuam os mesmos.

## iPhone — AppFlow, sem rodar nada no Mac

1. No AppFlow, iniciar um build de iOS a partir do commit mais novo do repositório (o "Entrada livre, assinatura após 3").
2. Conferir que o build reporta 1.3 e build 37.
3. Enviar para o TestFlight, abrir no iPhone e conferir: entra sem pagar, assiste 3 aulas, a 4ª pede assinatura.
4. Submeter para revisão. Na disponibilidade, manter a China continental fora.

Nenhum comando é necessário: o AppFlow builda a partir do que está no GitHub, então o arquivo solto que travou o `git pull` na sua máquina não interfere.

## Android — precisa atualizar a pasta uma vez

A pasta no seu Mac ainda está na versão antiga, então o arquivo gerado sairia com o código de versão repetido. Rodar tudo na raiz do projeto — a pasta que tem `package.json`, `android` e `ios` lado a lado — e nunca de dentro de `android`. De dentro de `android`, o `git checkout` com o caminho do iPhone não encontra o arquivo, e o script de sincronização pode gravar as coisas no lugar errado.

```text
cd "/Users/caioroberto/Desktop/Projetos Bibliatoon Club/BibliaToon Club APP"
git checkout -- ios/App/App.xcodeproj/project.pbxproj
git pull
npm install
npm run sync:android
```

Depois, no Android Studio: Build → Generate Signed App Bundle or APK → variante release → enviar o `app-release.aab` pelo Play Console.

Se a pasta for movida para fora da Área de Trabalho (recomendado, o iCloud foi o que gerou os arquivos duplicados que quebraram o build antes), usar o caminho novo no primeiro comando e repetir o `npm install` lá.

## Notas da versão (iguais nas duas lojas)

Entre grátis e assista 3 aulas sem pagar; assinatura direto pela loja, nova tela inicial e correções.

Revisar a descrição pública: entrada e uso livres, assinatura só depois dos 3 vídeos.

## Depois que as lojas aprovarem

- Publicar o live update no canal Production e confirmar no rodapé do Perfil a versão 2026-10-16-v1.
- Testar com uma conta sem assinatura: 3 aulas abrem, a 4ª bloqueia, o card "Seja Premium" aparece no Perfil.
- Nos dois projetos do RevenueCat: Restore Behavior = "Keep with original App User ID".

## Detalhes técnicos

- Commit no GitHub: `23f6268` — contém as duas bumps de versão.
- iPhone: `ios/App/App.xcodeproj/project.pbxproj` com `MARKETING_VERSION = 1.3` e `CURRENT_PROJECT_VERSION = 37`.
- Android: `android/app/build.gradle` com `versionCode 9` e `versionName "2.2.4"`.
- O `git checkout` desfaz apenas o `project.pbxproj` local (lixo gerado pelo Xcode); não encosta em nada do Android.
- Se o Play Console reclamar de versionCode repetido, o `git pull` não foi concluído. Se aparecer arquivo duplicado com espaço no nome ou "defined multiple times", apagar `android/app/build` e tirar o projeto da pasta sincronizada pelo iCloud.
