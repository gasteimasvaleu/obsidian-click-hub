# Trocar o vídeo do topo do Amigo Divino

Trocar o vídeo do topo da tela Amigo Divino pelo vídeo que você enviou (horizontal, cerca de 8 segundos).

- O tamanho e o formato do quadro continuam os mesmos, e o vídeo continua tocando sozinho como hoje.
- O vídeo antigo não será apagado; só deixa de aparecer nessa tela.

## Detalhes técnicos
- Subir o arquivo com lovable-assets para src/assets/amigo-divino/amigo-divino-topo.mp4.asset.json.
- Em src/pages/AmigoDivino.tsx, trocar o src fixo do Supabase Storage por `amigoTopo.url`, mantendo os demais atributos.
