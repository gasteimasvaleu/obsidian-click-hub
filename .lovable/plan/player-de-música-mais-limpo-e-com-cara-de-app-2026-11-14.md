# Player de música mais limpo e com cara de app

Hoje o player mostra a descrição inteira da música (com emojis), o que deixa o card enorme e tampa a tela, e ainda usa o brilho verde antigo.

## Como fica
**Mini player (padrão)**: uma barra compacta flutuando acima do menu inferior:
- Capa da música (ou desenho de nota musical se não houver), título em uma linha, barra fina de progresso na base do card.
- Botões: Play/Pausa grande violeta e Próxima. Um X pequeno para fechar.
- Tocar na barra abre o player completo.

**Player completo (abre de baixo para cima)**:
- Capa grande com cantos arredondados e o equalizador animado.
- Título em bolha violeta (padrão do app) e descrição em card branco, sem emojis, com "Ver mais" para expandir.
- Barra de progresso com tempos dos dois lados (0:17 ... 4:08).
- Controles: Aleatório, Anterior, Play/Pausa grande, Próxima, Repetir; volume no tablet/computador.
- Seta para baixo para voltar ao mini player.

**Visual**: sombra e borda violeta no lugar do verde; cantos arredondados e fundo branco como os demais cards.

## Detalhes técnicos
- `src/components/audiofy/AudioPlayer.tsx`: estado `expanded`; mesmo `<audio>` e lógica atuais. Mini: `fixed bottom-20` com `h-16`, `thumbnail_url`, `truncate`, progresso `h-1 bg-primary`. Completo: overlay `fixed inset-0 z-50 bg-background` com animação slide-up, `SectionHeader`, `stripEmoji` + `line-clamp-3` com toggle.
- Remover `shadow-[...rgba(0,255,102...)]`, usar tokens `primary`.
