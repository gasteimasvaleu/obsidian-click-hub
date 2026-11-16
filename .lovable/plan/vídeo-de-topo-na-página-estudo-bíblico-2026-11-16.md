# Vídeo de topo na página Estudo Bíblico

Colocar o vídeo enviado no topo da página Estudo Bíblico, igual às outras páginas (Bíblia, Comunidade, Bíbliafy).

## O que muda
- Novo quadro de vídeo logo abaixo do menu, antes do card "Estudo Bíblico", no formato horizontal e com a largura de sempre.
- O vídeo começa sozinho, sem som, e toca uma vez só (sem repetir).
- O card "Estudo Bíblico" continua igual, com o desenho pequeno e o texto.

## Detalhes técnicos
- Subir o vídeo com lovable-assets para src/assets/estudo/estudo-topo.mp4.asset.json.
- Em src/pages/estudo/EstudoListPage.tsx, inserir antes do BubbleSection um `GlassCard className="w-full p-0 overflow-hidden mb-6"` com `<video src={estudoTopo.url} className="aspect-video w-full h-auto object-cover" autoPlay muted playsInline />` (sem loop).
