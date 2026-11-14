# Trocar o ícone oficial do app

## Como funciona
O ícone oficial vai dentro do pacote enviado à Apple e ao Google Play. Por isso ele só muda nos celulares depois que você enviar uma versão nova às lojas.

## O que preciso de você
- A imagem do novo ícone, quadrada, de preferência 1024x1024, sem cantos arredondados (as lojas arredondam sozinhas) e sem transparência.

## O que eu faço quando receber a imagem
1. Uso a imagem como base única do ícone.
2. Gero todos os tamanhos do iPhone e do Android (incluindo o ícone adaptativo do Android, com o desenho centralizado numa área segura para não ser cortado).
3. Atualizo também o ícone da aba do navegador e o atalho na tela inicial, para tudo ficar igual.
4. Confiro que nada além dos ícones foi alterado nos projetos nativos.

## Depois, no seu computador
- Baixar o projeto atualizado, rodar `npm run build` e `npx cap sync`, e gerar as versões novas (iOS e Android) para envio às lojas.
- Na App Store Connect, o ícone da página da loja vem do próprio pacote enviado.

## Detalhes técnicos
- Base: `assets/icon.png` e `assets/icon-only.png`; gerar com `@capacitor/assets` (já instalado), atualizando `ios/App/App/Assets.xcassets/AppIcon.appiconset` e `android/app/src/main/res/mipmap-*`.
- Reverter qualquer alteração do gerador fora dos ícones (splash, AndroidManifest).
- Favicon: `public/favicon.png` 64x64, link no `index.html`, remover `public/favicon.ico`.
