# Novo botão de voltar (curso, módulo e aula)

## O que muda
Os botões "Voltar para Plataforma", "Voltar para o Curso" e "Voltar para o Módulo" passam a ser uma barra violeta que ocupa toda a largura da tela, com o mesmo efeito bolha e a mesma borda luminosa dos títulos.
- Dentro da barra não há texto, só setinhas brancas apontando para a esquerda.
- As setinhas vão ficando mais transparentes conforme chegam à esquerda.
- Elas correm em sequência para a esquerda, como uma barra de progresso.
- Com "reduzir movimento" ligado no aparelho, as setinhas ficam paradas.
- Leitores de tela continuam ouvindo o nome do destino, por exemplo "Voltar para o Curso".

## Detalhes técnicos
- Novo componente `src/components/plataforma/BackArrowButton.tsx`, com as props `to` e `label`, usado como `aria-label`. Ele é um `Link` com `w-full h-12` e as classes `neon-glow-user feature-bubble bubble-user`, mais `border-beam`, e mostra cerca de 7 `ChevronLeft` brancos. A opacidade sobe da esquerda (0.15) para a direita (1).
- Animação `back-arrow-flow` em `src/index.css`: deslocamento para a esquerda e pulso de opacidade, com atraso escalonado por seta e `prefers-reduced-motion` desligando tudo.
- Substituir os botões em `CoursePage.tsx`, `ModulePage.tsx` e `LessonPage.tsx`, nas linhas próximas a 116–141. Os botões de erro "Voltar para Plataforma" das telas sem conteúdo ficam como estão.
