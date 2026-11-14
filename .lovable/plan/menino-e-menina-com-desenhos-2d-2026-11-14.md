# Menino e Menina com desenhos 2D

## O que muda
No passo "Sexo da criança" do Guia para Pais, os dois botões passam a mostrar desenhos 2D sem fundo, no mesmo estilo cartoon dos desenhos do menu Mais e dos livros da Bíblia.
- **Menino:** um menino sorridente, com roupa simples e cores alegres.
- **Menina:** uma menina sorridente no mesmo estilo.
- O desenho fica grande, ocupando a maior parte do botão, com o nome "Menino" ou "Menina" pequeno embaixo.
- O botão escolhido continua com a borda e o fundo violeta. O outro fica um pouco mais apagado, para destacar a escolha.

## Detalhes técnicos
- Gerar 2 imagens transparentes (`src/assets/guia-pais/menino.png` e `menina.png`) com o gerador de imagens. Elas devem combinar com o estilo das outras ilustrações e não podem ter texto.
- `ParentsGuideForm.tsx`: em cada `Card`, adicionar `<img className="mx-auto h-28 w-28 object-contain" alt="">`, com o nome em `text-sm font-semibold` embaixo. No não selecionado, usar `opacity-70` quando o outro já estiver escolhido.
