# Animação de carregamento em tela cheia

## O que muda
- O vídeo de Jesus com a criança passa a ocupar a tela toda no celular (formato 9:16, como a animação antiga), em vez de ficar num retângulo pequeno no meio.
- Os bonecos ficam centralizados na tela. No vídeo original eles ficam na parte de baixo; vou gerar uma nova versão do vídeo deslocando o enquadramento para que fiquem no centro, completando com o mesmo fundo claro.
- A barra de progresso violeta e a mensagem (ex.: "Transformando sua foto em desenho...") ficam por cima do vídeo, na parte de baixo da tela.
- O fundo da tela passa a ter a mesma cor do fundo do vídeo, para não aparecer emenda. No tablet e no desktop, o vídeo também cobre a tela, com os bonecos centralizados.

## Detalhes técnicos
- Reprocessar `jesus-crianca.mp4` com ffmpeg: adicionar fundo da cor do vídeo embaixo e recortar o topo vazio, para o centro dos personagens ficar em 50% da altura. Manter 9:16, H.264, sem áudio, com +faststart, e enviar como novo asset (o antigo é apagado).
- `src/components/LoadingOverlay.tsx`: vídeo `absolute inset-0 h-full w-full object-cover object-center`, fundo com a cor amostrada do vídeo, e barra + mensagem num bloco `absolute bottom-[calc(env(safe-area-inset-bottom)+3rem)]`. As travas de autoplay do iOS continuam.
