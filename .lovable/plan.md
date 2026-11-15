# Títulos dos cards menores no celular

## O que muda
Os títulos nas faixas violeta dos cards (por exemplo "Módulos do Curso", o nome do curso e os títulos das seções da Bíblia, do Perfil, do Estudo Bíblico e das outras páginas) ficam menores no celular. Hoje eles estão grandes demais para a tela.

- No celular: de 24px para 20px, mantendo o peso forte e o gradiente na última palavra.
- No tablet e no computador: continua como está hoje (24px).

Como todos esses títulos usam o mesmo estilo, a mudança vale para o app inteiro de uma vez.

## Detalhes técnicos
- `src/index.css`, classe `.bubble-title`: `font-size: 1.25rem` como padrão e `@media (min-width: 768px) { font-size: 1.5rem }`.
- Conferir com uma captura em 393px de largura que os títulos longos não quebram de forma estranha.
