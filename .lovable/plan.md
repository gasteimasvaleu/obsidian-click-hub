# Cards de Jogos com melhor UX

Hoje cada card tem um ícone pequeno, uma etiqueta colorida solta, um texto longo inteiro e um botão grande. Fica cansativo de rolar e foge do padrão do app.

## Proposta
- **Título em bolha violeta**, com o card branco preso embaixo, como em Orações e na Bíblia. "Quizz" vira "Quiz" só na exibição.
- **Desenho 2D por tipo de jogo** no lugar do ícone: Quiz, Memória, Caça-palavras e Quebra-cabeça, com 4 desenhos novos no estilo dos outros, à esquerda do texto.
- **Etiquetas discretas em linha**: tipo de jogo e dificuldade (Fácil verde, Médio âmbar, Difícil vermelho, em tom suave).
- **Descrição curta**: até 3 linhas, com "Ver mais" para abrir o resto.
- **Card inteiro clicável**, além do botão "Jogar" violeta com a largura do card e a seta animada do app.
- Cards mais baixos, então cabem mais jogos na tela do celular. No tablet e no desktop ficam 2 por linha.

## Detalhes técnicos
- `src/pages/Games.tsx`: o card vira um bloco com bolha (`neon-glow-user feature-bubble bubble-user` + border-beam + `BubbleTitleText`) + `GlassCard -mt-4 pt-7 rounded-t-none`, com `onClick` de navegação, `img h-16 w-16`, `line-clamp-3` e estado de expandir por id. Grid `grid gap-4 sm:grid-cols-2`.
- Gerar 4 imagens em `src/assets/games/{quiz,memory,wordsearch,puzzle}.png.asset.json` (fundo magenta e recorte, mesmo pipeline das outras) e mapear por `game.type`, com o ícone atual como reserva.
