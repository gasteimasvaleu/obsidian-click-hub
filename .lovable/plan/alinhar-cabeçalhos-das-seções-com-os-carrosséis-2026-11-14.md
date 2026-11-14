# Alinhar cabeçalhos das seções com os carrosséis

Os cards de título e subtítulo vão ocupar a mesma largura dos carrosséis, com as bordas esquerda e direita alinhadas às capas de baixo.

## Detalhes técnicos
- `src/components/plataforma/CourseCarousel.tsx`: remover o `px-4` extra do contêiner do cabeçalho (`mb-4 px-4` → `mb-4`), para ele herdar o mesmo recuo lateral do carrossel.
