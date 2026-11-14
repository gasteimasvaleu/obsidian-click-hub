# Tablet: "Próximas aulas" ao lado de "Materiais complementares"

No tablet, o card "Próximas aulas" aparece sozinho, embaixo de todo o resto da aula.

## O que muda
- No tablet, "Materiais complementares" fica à esquerda e "Próximas aulas" à direita, na mesma linha, em duas colunas iguais.
- Se a aula não tiver materiais, "Próximas aulas" ocupa a linha inteira.
- No celular (lista que abre e fecha) e no computador (coluna fixa à direita), nada muda.

## Detalhes técnicos
- `LessonPlayer.tsx`: envolver os materiais num `md:grid md:grid-cols-2 md:gap-4 lg:block` e incluir nessa grade um card "Próximas aulas" visível só entre md e lg (`hidden md:block lg:hidden`), com o mesmo visual da coluna lateral.
- A coluna lateral atual passa a aparecer só a partir de lg (`hidden lg:block`).
