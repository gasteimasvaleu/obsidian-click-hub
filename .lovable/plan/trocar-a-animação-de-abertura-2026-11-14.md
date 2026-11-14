# Trocar a animação de abertura

## Resposta
Sim: a imagem nativa (a parada, que vai no pacote das lojas) deve ser igual ao primeiro quadro da animação. Assim a passagem da imagem para o vídeo não pisca.

## O que você precisa fazer
Enviar aqui no chat o vídeo novo, de preferência:
- vertical (9:16), em MP4;
- com até 6 segundos (ou me avise que é mais longo, para eu aumentar o limite);
- com o mesmo fundo do começo ao fim, para a entrada no app ficar suave.

## O que eu faço quando o vídeo chegar
1. Troco a animação dentro do app. A troca chega a todos os celulares sem enviar uma versão nova às lojas.
2. Tiro o primeiro quadro do vídeo e uso como imagem de espera, enquanto o vídeo carrega.
3. Salvo esse mesmo quadro como a nova imagem nativa (assets/splash.png).
4. Ajusto o tempo máximo da animação, se o vídeo passar de 6 segundos.

## O que fica com você
A imagem nativa só muda nos celulares depois de você gerar e enviar uma versão nova às lojas. Antes do build de iPhone e Android, rode:
`npx @capacitor/assets generate`, depois `npm run build` e `npx cap sync`.

## Detalhes técnicos
- src/components/SplashScreen.tsx: troco SPLASH_VIDEO_URL e SPLASH_IMAGE_URL pelos novos arquivos hospedados com lovable-assets e, se precisar, ajusto MAX_DISPLAY_MS.
- Gero o primeiro quadro com ffmpeg em 2732x2732, com o desenho centralizado sobre a cor do fundo, como o @capacitor/assets pede.
