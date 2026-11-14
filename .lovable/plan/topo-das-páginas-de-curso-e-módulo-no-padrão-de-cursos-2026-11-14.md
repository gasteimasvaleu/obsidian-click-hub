# Topo das páginas de curso e módulo no padrão de Cursos

## O que muda
Nas páginas de cada curso e de cada módulo, o topo segue o mesmo modelo da página Cursos:
- A imagem de fundo com o texto escuro por cima sai.
- No lugar, entra a imagem num card 16:9 arredondado, com borda luminosa e sombra.
- Logo abaixo vem o título no card bolha violeta e a descrição no card branco colado, com "Ver mais".

As páginas de aula já têm o vídeo em cima e o título em bolha, então ficam como estão.

## Detalhes técnicos
- `CoursePage.tsx` e `ModulePage.tsx`: `ResponsiveHeroBanner` com `card`, `overlay={false}`, sem `bottomGradient`, proporção 16/9 em celular e desktop. Usar a imagem horizontal (desktop) também no celular, porque a vertical ficaria muito cortada no 16:9, com a vertical como reserva quando não houver horizontal.
- Adicionar `SectionHeader` (título + descrição) logo abaixo do banner, com `className="mb-0 px-4"`, igual a `PlataformaPage.tsx`.
