# Capas inteiras nos carrosséis + tamanhos certos no painel

## Carrosséis
- O carrossel "Cursos" continua em 9:16, que é o formato das capas novas.
- Os carrosséis de módulos (ex.: "Caim e Abel") voltam ao formato antigo e mais alto (300x580), então as capas aparecem inteiras, sem cortar a parte de baixo.
- A imagem fica presa ao topo, então se alguma capa tiver formato diferente o corte cai embaixo, nunca no título.

## Painel de administração: tamanhos indicados
- **Curso, capa (Thumbnail):** de 300x580 para **1080x1920** (9:16)
- **Curso, imagem do topo (Imagem Desktop):** de 1440x730 para **1920x1080** (16:9), que é o formato das imagens novas e agora também é usado no celular
- **Módulo, capa:** continua **300x580**
- Os demais campos não mudam.

## Detalhes técnicos
- `CourseCarousel.tsx`: nova prop opcional `ratio` (padrão 9/16) e `object-top` na imagem.
- `PlataformaPage.tsx`: carrosséis de módulos com `ratio={300 / 580}`.
- `CoursesManager.tsx`: `dimensions` do Thumbnail = "1080x1920" e da Imagem Desktop = "1920x1080".
- `CoursePage.tsx`: usar 16:9 também nos cursos sem imagem trocada no código, para que as imagens novas enviadas pelo painel apareçam inteiras.
