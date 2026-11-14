# Títulos das seções da Bíblia no card bolha violeta

## O que muda
Na página Bíblia, os títulos das seções de livros passam a usar o card bolha violeta com borda luminosa e a fonte grossa do sistema, com a última palavra em gradiente, igual aos títulos dos Cursos. Isso vale para os dois testamentos: Pentateuco, Livros Históricos, Evangelhos e as demais seções.

## Detalhes técnicos
- `BibliaPage.tsx`: importar `SectionHeader` de `@/components/plataforma/CourseCarousel` e trocar os dois `<h2>` (linhas 152 e 168) por `<SectionHeader title={category.name} className="mb-4" />`.
