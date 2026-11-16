# Enviar a nova versão para as lojas

Não é preciso mudar nada no app. Siga os passos abaixo no seu computador, dentro da pasta do projeto atualizado (baixe a versão mais recente antes). Pule o `npx @capacitor/assets generate`, porque o ícone e a tela de abertura já estão prontos.

## Feito por mim aqui no projeto
- iPhone: versão 1.3.1 para 1.4, build 39 para 40.
- Android: versão 2.2.4 para 2.3.0, código 9 para 10.
Assim você não precisa mudar esses números no Xcode nem no Android Studio.
(Detalhe técnico: MARKETING_VERSION/CURRENT_PROJECT_VERSION em ios/App/App.xcodeproj/project.pbxproj; versionName/versionCode em android/app/build.gradle.)

## 0. Instalar o Node (o erro "command not found: npm" do seu print)
Seu Mac está sem o Node, ou o terminal não está achando o Node. Rode:
```text
source ~/.nvm/nvm.sh && nvm use --lts
```
Se aparecer erro, o Node não está instalado. Baixe a versão LTS em nodejs.org, instale, feche e abra o Terminal de novo, e confira com `node -v` e `npm -v`.

## 1. Instalar dependências
```text
npm install
```

## 2. iPhone (no Mac)
```text
npm run sync:ios
```
- Abra ios/App/App.xcodeproj no Xcode.
- Product > Archive > Distribute App > App Store Connect.

## 3. Android
```text
npm run sync:android
```
- Abra a pasta android no Android Studio.
- Build > Generate Signed App Bundle (AAB) e envie ao Google Play Console.

## O que vai nesta versão
Ícone novo, tela de abertura nova, visual violeta claro, 5 aulas grátis, Estudo Bíblico e vídeos novos no topo das páginas (os vídeos já estão no ar, mesmo sem versão nova).
