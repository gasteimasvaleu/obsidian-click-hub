# Imagem do topo inteira, sem corte

## Por que ela aparece cortada
As imagens dos módulos foram feitas no formato 1440×730, que é mais comprido que o padrão de vídeo. As miniaturas das aulas, mais abaixo, usam exatamente esse formato, então a imagem cabe inteira.

O card do topo, que eu ajustei antes, está fixo no formato de vídeo 16:9, que é um pouco mais alto. Para preencher esse espaço, a imagem é ampliada e as laterais ficam de fora.

## Correção
Quando o topo mostrar uma imagem, o card usa o mesmo formato 1440×730 das miniaturas. Assim a imagem aparece inteira, nas páginas de curso e de módulo.

O topo da página Cursos, que mostra um vídeo, continua em 16:9.

## Detalhes técnicos
- `CoursePage.tsx` e `ModulePage.tsx`: `aspectRatioDesktop` e `aspectRatioMobile` passam de `16 / 9` para `1440 / 730`.
