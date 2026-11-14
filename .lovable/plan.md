# Guia para Pais: título em card bolha e sombra sem corte

## O que muda
- O card branco do topo, com "Guia para Pais" e o texto, passa para o padrão da Bíblia e dos Cursos: título no card bolha violeta com borda luminosa e a fonte grossa, com "Pais" em gradiente.
- O texto "Crie um guia personalizado para ensinar a Bíblia ao seu filho" fica no card branco colado logo abaixo do título.
- As sombras dos cards dessa página deixam de aparecer cortadas.

## Detalhes técnicos
- `ParentsGuideForm.tsx`: trocar o `GlassCard` do cabeçalho (linhas 90–97) por `<SectionHeader title="Guia para Pais" description="Crie um guia personalizado para ensinar a Bíblia ao seu filho" className="mb-8" />`, importado de `@/components/plataforma/CourseCarousel`.
- Remover `overflow-hidden` do contêiner do formulário (linha 88) e do contêiner `pt-16 px-4` em `GuiaPais.tsx` (linha 154). A rolagem lateral continua bloqueada pelo `overflow-x-hidden` da raiz.
