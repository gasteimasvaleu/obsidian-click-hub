# Fazer os vídeos, a abertura e as imagens enviadas pelo chat aparecerem no app

## O que está acontecendo
Os vídeos e imagens que você mandou pelo chat ficam guardados no site (bibliatoonclub.com), e o app procura por eles com um endereço "curto", sem o nome do site. No navegador funciona, porque o endereço curto aponta para o próprio site. Dentro do app do celular, ele aponta para dentro do aparelho, onde esses arquivos não existem, e por isso nada aparece. Isso afeta os vídeos do topo das páginas, a abertura animada, o vídeo de carregamento e os desenhos dos 73 livros.

## O que vou fazer
- Fazer o app sempre usar o endereço completo desses arquivos (https://bibliatoonclub.com/...), de uma vez só para todos eles, sem mexer tela por tela.
- No navegador nada muda.

## O que você faz depois
- Gerar um build Web novo no Appflow e publicar no canal Production (não precisa enviar versão nova às lojas).
- Fechar e abrir o app duas vezes para receber a atualização.

## Detalhes técnicos
- Plugin no `vite.config.ts` (enforce: 'pre') que transforma imports `*.asset.json`: quando `url` começa com `/__l5e/`, prefixa com `https://bibliatoonclub.com`. Cobre os 23 arquivos que importam ponteiros, incluindo SplashScreen, LoadingOverlay e bookIllustrations.
- Conferir que o arquivo é servido em https://bibliatoonclub.com/__l5e/... com CORS/Range ok para `<video>`.

## Versões novas para reenviar às lojas
- iPhone: versão 1.5, build 41 (antes 1.4 build 40) — `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` no projeto iOS.
- Android: versão 2.3.1, código 11 (antes 2.3.0 código 10) — `versionName` / `versionCode` em `android/app/build.gradle`.
- Depois: `npm run sync:ios` e `npm run sync:android`, gerar IPA e AAB e enviar.
