# Nova animação na tela de carregamento

A tela de "carregando" do app tem hoje um fundo preto com a animação antiga. Ela passa a mostrar o vídeo enviado (Jesus caminhando de mãos dadas com a criança).

## Como vai ficar
- **Fundo:** branco/cinza clarinho do app no lugar do preto, para combinar com o fundo branco do vídeo e não aparecer um "quadrado".
- **Animação:** o novo vídeo centralizado na tela, do mesmo jeito da atual, em loop, sem som e começando sozinho (inclusive no iPhone).
- **Barra de progresso e mensagem:** continuam abaixo do vídeo, com a barra em violeta e o texto em cinza escuro, para ler bem no fundo claro.

## Detalhes técnicos
- Comprimir o vídeo (720x1280, 8 s): sem áudio, H.264, `+faststart`, menor resolução (~480 px de largura), e enviar com `lovable-assets` para `src/assets/loading/jesus-crianca.mp4.asset.json`.
- `src/components/LoadingOverlay.tsx`: `src` usa o asset; `bg-black` vira `bg-background`; vídeo `h-72 w-auto object-contain` centralizado; trilho da barra `bg-primary/15`; mensagem `text-muted-foreground`.
- A splash de abertura do app não muda.
