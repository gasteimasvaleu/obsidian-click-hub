# Cabeçalho dos livros e capítulos no padrão bolha

## O que muda
Na página de capítulos de um livro, como Gênesis, e na página de leitura de um capítulo:
- O card com o nome do livro passa a usar o mesmo card bolha violeta das outras páginas. O título fica com a fonte padrão, com a última palavra em destaque, e a quantidade de capítulos aparece no card branco logo abaixo, como subtítulo. Na leitura, o subtítulo mostra o capítulo.
- O botão "Voltar" vira a barra violeta de largura total com as setinhas animadas, a mesma das páginas de curso, módulo e aula, colocada acima do card. Nos capítulos, ela volta para a Bíblia. Na leitura, volta para a lista de capítulos do livro.
- As duas páginas passam a usar a mesma largura e as mesmas margens laterais da Bíblia.

## Detalhes técnicos
- `BookChaptersPage.tsx` e `ChapterReaderPage.tsx`: trocar o `GlassCard` com `h1` e o `Button` ghost por `<BackArrowButton to=... label="Voltar" className="mb-4" />` e `<SectionHeader title={book.name} description={...} className="mb-6" />`, ambos importados de `components/plataforma`.
- Mudar o contêiner das duas páginas para `container mx-auto px-4 pt-20 max-w-[58rem]`.
