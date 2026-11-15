# Comandos para gerar as versões com o ícone novo

Não rode `npx @capacitor/assets generate`. O ícone e a tela de abertura já estão prontos. Esse comando refaria o ícone do Android sem a folga, e o livro poderia ficar cortado.

## No terminal, dentro da pasta do projeto atualizado

```text
npm install
```

### iPhone (Mac)
```text
npm run sync:ios
```
(faz o build, o sync, a correção de assinatura e o pod install)
Depois: abra `ios/App/App.xcodeproj` no Xcode, aumente o número do build e envie para a App Store.

### Android
```text
npm run sync:android
```
(faz o build, o sync e recria o MainActivity com o ID certo)
Depois: abra a pasta `android` no Android Studio, aumente o versionCode e gere o AAB assinado.

## Mudanças no projeto
Nenhuma.
