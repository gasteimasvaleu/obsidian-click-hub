# Tela do Quiz no padrão do app

## O que muda
- **Título**: vira a bolha violeta padrão, com a última palavra em gradiente ("Quizz" aparece como "Quiz"). Saem o texto em gradiente solto e a etiqueta "Médio". A dificuldade vira uma etiqueta suave (Fácil verde, Médio âmbar, Difícil vermelho) dentro do card branco preso embaixo da bolha.
- **Progresso**: no mesmo card, uma barra arredondada dividida em duas metades com ícones: "Pergunta 1/10" e "Pontuação 0/10". Abaixo, a barra de progresso fina violeta, arredondada e mais grossa.
- **Card da pergunta**: a pergunta vira bolha violeta, com o card branco anexado embaixo.
  - As alternativas viram linhas arredondadas, com a letra (A, B, C, D) numa bolinha violeta clarinha. A escolhida fica em violeta.
  - Depois de responder: a certa fica verde e a errada vermelha suave.
  - O retorno ("Correto!" / "Ops!") vira um bloco suave com o versículo em itálico.
- **Próxima pergunta**: o botão vira a barra violeta de setinhas animadas do app, com a largura do card.
- A página passa a ter a mesma largura da Bíblia.

## Detalhes técnicos
- `src/pages/games/QuizPlayer.tsx`: usar o padrão de bolha + `GlassCard -mt-4 pt-7 rounded-t-none`, a barra `rounded-full border divide-x` e `ArrowNavButton direction="right"`. Trocar as cores `red-*` pelos tokens `destructive`/`success`. O main fica com `container px-4 max-w-[58rem]`.
