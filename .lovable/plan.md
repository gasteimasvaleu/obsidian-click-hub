# Player completo como janela flutuante, mais baixo

## O que muda
- **Ondas sonoras mais baixas:** o card das ondas deixa de ser 16:9 e fica numa faixa mais baixa (cerca de 1/3 da altura atual, formato 3:1).
- **Janela flutuante:** o player deixa de cobrir a tela toda. Vira uma janela com margem nas laterais, cantos arredondados, borda fina violeta e o fundo desfocado (como os outros avisos do app).
- **Não fica atrás do menu:** a janela termina acima do menu inferior e começa abaixo do topo; se a descrição for grande, rola dentro da janela.
- Tocar fora da janela minimiza para a barrinha.

## Detalhes técnicos
- `AudioPlayer.tsx`: overlay `fixed inset-0 z-50 bg-background/30 backdrop-blur-md` (clique minimiza); painel `absolute inset-x-4 top-[calc(env(safe-area-inset-top)+1rem)] bottom-24 mx-auto max-w-lg overflow-y-auto rounded-3xl border border-primary/40 bg-card p-4 shadow-xl`; card do equalizador `aspect-[3/1] py-4`.
