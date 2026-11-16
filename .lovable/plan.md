# Enviar a nova versão para as lojas

Não é preciso mudar nada no app. Siga os passos abaixo no seu computador, dentro da pasta do projeto atualizado (baixe a versão mais recente antes). Pule o `npx @capacitor/assets generate`, porque o ícone e a tela de abertura já estão prontos.

## 1. Instalar dependências
```text
npm install
```

## 2. iPhone (no Mac)
```text
npm run sync:ios
```
- Abra ios/App/App.xcodeproj no Xcode.
- Aumente o Build de 37 para 38 (a versão pode continuar 1.3 ou subir para 1.4).
- Product > Archive > Distribute App > App Store Connect.

## 3. Android
```text
npm run sync:android
```
- Abra a pasta android no Android Studio.
- Em app/build.gradle: versionCode 9 para 10 e versionName 2.2.4 para 2.2.5.
- Build > Generate Signed App Bundle (AAB) e envie ao Google Play Console.

## O que vai nesta versão
Ícone novo, tela de abertura nova, visual violeta claro, 5 aulas grátis, Estudo Bíblico e vídeos novos no topo das páginas (os vídeos já estão no ar, mesmo sem versão nova).
