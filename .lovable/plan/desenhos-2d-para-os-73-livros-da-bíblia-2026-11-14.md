# Desenhos 2D para os 73 livros da Bíblia

## O que muda
- Em cada card da página Bíblia, o ícone de livro com fundo colorido é substituído por um desenho 2D, sem fundo, que lembra o livro. Exemplos: Gênesis = criação (sol, terra e plantas), Êxodo = Moisés abrindo o mar, Salmos = harpa, Jonas = baleia, Mateus = evangelista com o livro, Apocalipse = cordeiro.
- O estilo é o mesmo dos desenhos do menu Mais: cartoon infantil, traço limpo, cores vivas e fundo transparente.
- O desenho fica no lugar do ícone atual, um pouco maior (cerca de 56px), e o restante do card não muda.
- Se algum livro não tiver desenho, o ícone atual continua aparecendo.

## Como será feito
- Gero as 73 imagens aos poucos, por blocos (Pentateuco, Históricos, Sabedoria, Profetas, Evangelhos e Atos, Cartas e Apocalipse), e confiro cada bloco antes de seguir.
- Cada imagem é hospedada fora do app, para não deixá-lo pesado.

## Detalhes técnicos
- Novo `src/data/bookIllustrations.ts`: mapa do nome normalizado do livro (sem acento, minúsculo) para a URL do asset, com os 73 nomes da Ave Maria.
- `BibliaPage.tsx` (`BookCard`): `<img>` com `h-14 w-14 object-contain`, lazy loading e fallback para o `BookOpen` atual.
- Imagens geradas em PNG transparente, reduzidas para 256px e enviadas com `lovable-assets` para `src/assets/livros/*.png.asset.json`.
