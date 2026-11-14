# Mostrar inteiras as capas dos carrosséis de módulos

Quando mudei os cards para o formato 9:16 (por causa das capas novas dos cursos), as capas dos módulos (ex.: "Caim e Abel"), que são um pouco mais compridas (formato antigo 300x580), passaram a perder uma faixa.

## O que muda
- O carrossel "Cursos" continua em 9:16, porque as capas novas são desse formato.
- Os carrosséis de módulos voltam ao formato antigo e mais alto (300x580), então as capas aparecem inteiras, sem cortar a parte de baixo.
- A imagem fica ancorada no topo, para que, se alguma capa tiver formato diferente, o corte nunca caia no texto da parte de baixo.

## Detalhes técnicos
- `CourseCarousel.tsx`: nova prop opcional `ratio` (padrão 9/16).
- `PlataformaPage.tsx`: os carrosséis de módulos passam `ratio={300 / 580}`.
- Antes de editar, confirmar o tamanho real de uma capa de módulo; se não for 300x580, usar a proporção real dela.
