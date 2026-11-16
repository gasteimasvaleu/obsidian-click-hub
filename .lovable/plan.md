# Corrigir "command not found: npm" no Mac

Não precisa mudar nada no app. O Mac não está encontrando o Node.js, o programa que traz o comando `npm`. Ou ele não está instalado, ou foi instalado e o Terminal não sabe onde ele está.

## Passo 1: ver se o Node existe
No Terminal, rode:
```
ls ~/.nvm 2>/dev/null; which node; ls /opt/homebrew/bin/node /usr/local/bin/node 2>/dev/null
```
- Se aparecer `~/.nvm`, rode: `source ~/.nvm/nvm.sh && nvm use --lts`. Depois vá para o Passo 3.
- Se aparecer `/opt/homebrew/bin/node`, rode: `echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile && source ~/.zprofile`. Depois vá para o Passo 3.
- Se não aparecer nada, siga o Passo 2.

## Passo 2: instalar o Node (versão LTS)
1. Acesse https://nodejs.org e baixe o instalador "LTS" para macOS (.pkg).
2. Instale e feche o Terminal por completo (Cmd+Q).
3. Abra o Terminal de novo e confira com `node -v` e `npm -v`. Os dois devem mostrar um número de versão.

## Passo 3: gerar as versões
```
cd "/Users/caioroberto/Desktop/Projetos Bibliatoon Club/BibliaToon Club APP"
npm install
npm run sync:ios
npm run sync:android
```
Depois, gere o IPA no Xcode e o AAB no Android Studio. Por fim, publique um build Web no Appflow, no canal Production.

## Se `npm install` der erro de CocoaPods no iOS
Rode `sudo gem install cocoapods` e repita `npm run sync:ios`.
