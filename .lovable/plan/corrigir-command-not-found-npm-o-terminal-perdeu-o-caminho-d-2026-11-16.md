# Corrigir "command not found: npm": o Terminal perdeu o caminho do Node

Não precisa mudar nada no app. O Node está instalado. Esta janela do Terminal só não carregou o atalho que aponta para ele. Isso costuma acontecer depois de reiniciar o Mac ou atualizar o macOS.

## Passo 1: recarregar o caminho (rode um por vez e teste com `npm -v` depois de cada um)
1. `source ~/.zshrc`
2. Se ainda falhar, você provavelmente usa nvm: `source ~/.nvm/nvm.sh && nvm use default`
3. Se ainda falhar, você provavelmente usa Homebrew: `eval "$(/opt/homebrew/bin/brew shellenv)"`

Quando `npm -v` mostrar um número, o caminho voltou.

## Passo 2: deixar isso fixo para não acontecer de novo
- Se o que resolveu foi o nvm: `echo 'source ~/.nvm/nvm.sh' >> ~/.zshrc`
- Se o que resolveu foi o Homebrew: `echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile`

## Passo 3: gerar as versões
```
cd "/Users/caioroberto/Desktop/Projetos Bibliatoon Club/BibliaToon Club APP"
npm install
npm run sync:ios
npm run sync:android
```
Depois, gere o IPA no Xcode e o AAB no Android Studio. Por fim, publique um build Web no Appflow, no canal Production.
