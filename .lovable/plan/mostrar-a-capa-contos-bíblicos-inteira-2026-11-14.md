# Mostrar a capa Contos Bíblicos inteira

Hoje os cards de capa da página Cursos têm o formato 300x580, que é um pouco mais estreito e alto que o 9:16. Por isso a capa nova perde um pouco das laterais.

## Mudança
- Passar os cards de capa da página Cursos para o formato 9:16. Assim a capa de Contos Bíblicos aparece inteira.
- Todos os cards da mesma fileira continuam com a mesma altura. As capas antigas, que são 300x580, vão perder uma faixa bem fina em cima e embaixo (cerca de 4% de cada lado).

## Detalhes técnicos
- Em CourseCarousel.tsx, trocar `AspectRatio ratio={300 / 580}` por `ratio={9 / 16}`.
