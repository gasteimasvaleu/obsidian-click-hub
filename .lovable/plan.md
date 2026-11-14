# Escolher capítulo com barra deslizante

## O que muda (tela de capítulos de cada livro da Bíblia)
- A grade de cards numerados sai.
- Entra um card no padrão do app com:
  - o número do capítulo grande no centro ("Capítulo 12 de 50");
  - uma barra deslizante violeta de 1 até o último capítulo, para arrastar com o dedo;
  - setinhas "−" e "+" dos lados para ajustar de um em um;
  - um botão "Ler capítulo" (barra violeta de setinhas, igual às do app) que abre o capítulo escolhido.
- Começa no capítulo 1. Livros de 1 capítulo vão direto para o botão Ler.

## Detalhes técnicos
- Editar só `src/pages/biblia/BookChaptersPage.tsx`, usando o `Slider` do shadcn já instalado (`src/components/ui/slider.tsx`), sem instalar nada novo.
- Card em `BubbleSection`; − / + numa `SPLIT_BAR` h-11; botão de ler com `ArrowNavButton direction="right"`.
- Máximo do slider = `chapters.length`; navega para `/biblia/:bookId/:n`.
