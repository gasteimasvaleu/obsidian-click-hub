# Comportamento e Personalidade em carrossel com desenhos 2D

Boa ideia. São 9 opções em cada passo, então um carrossel com um card grande por vez, desenho em destaque e setinhas, fica mais bonito e mais fácil de tocar no celular.

## O que muda
Nos passos "Comportamento" e "Personalidade" do Guia para Pais:
- Os botões pequenos viram um carrossel com um card quadrado por vez. Cada card tem um desenho 2D sem fundo de uma criança expressando a característica, por exemplo um pulando (Agitado), um escondido atrás das mãos (Tímido) ou um com lupa (Curioso). O nome fica embaixo.
- As setinhas violetas animadas ficam dos lados, para ir ao anterior e ao próximo. Também dá para deslizar com o dedo.
- Tocar no card marca ou desmarca a opção. O card marcado ganha borda violeta e um selo de check.
- Embaixo do carrossel aparecem bolinhas indicando a posição, com as opções já escolhidas em destaque, e o texto "X selecionadas".
- Os desenhos seguem o mesmo estilo cartoon do menino e da menina, sem texto nas imagens.

## Desenhos (18)
- **Comportamento:** Agitado, Tímido, Curioso, Questionador, Obediente, Desafiador, Sensível, Carinhoso, Independente.
- **Personalidade:** Extrovertido, Introvertido, Criativo, Lógico, Emocional, Racional, Competitivo, Colaborativo, Aventureiro.

## Detalhes técnicos
- Gerar 18 PNGs transparentes em `src/assets/guia-pais/tracos/{slug}.png`, alternando menino e menina, com o mesmo prompt de estilo do `menino.png`.
- Criar `src/components/guia-pais/TraitCarousel.tsx` usando o `ui/carousel` (Embla), com um slide por vez em `aspect-square`. As setas usam o `ArrowNavButton` compacto (`!w-12 !h-12`) chamando `scrollPrev` e `scrollNext`. As props são `options`, `images`, `selected` e `onToggle`.
- `ParentsGuideForm.tsx`: trocar as grades de `Badge` dos passos 4 e 5 pelo `TraitCarousel`. A validação "pelo menos uma opção" continua igual.
