# Bíblia: alternar cores dos ícones dos livros (mantendo gradiente)

## Objetivo
Hoje todos os cards de livros da página /biblia usam o mesmo gradiente azul→roxo no ícone (BookOpen). Vamos alternar as cores entre os cards, mantendo o formato de gradiente, para a página ficar mais colorida.

## Como funciona
- Em `src/pages/biblia/BibliaPage.tsx`, o `BookCard` recebe um índice (posição do livro na lista) além do livro.
- Uma paleta fixa de gradientes (todos `bg-gradient-to-br`, cantos arredondados e ícone branco como já são hoje) será percorrida em ciclo: cada card pega a cor da sua posição.
- Paleta ( tons já usados no app, combinando com as cores dos cards da home ):
  1. Azul → Roxo (atual)
  2. Roxo → Rosa
  3. Amarelo → Laranja
  4. Vermelho → Rosa
  5. Verde-limão → Verde
  6. Verde → Ciano
  7. Rosa → Vermelho
  8. Índigo → Azul
- O ciclo reinicia a cada categoria (Pentateuco, Evangelhos etc.), então cada bloco começa colorido de forma variada.
- Sem mudança de layout, dados ou navegação — só a cor de fundo do ícone varia.

## Arquivo alterado
- `src/pages/biblia/BibliaPage.tsx` — constante de paleta + prop de índice no `BookCard` (usado nos dois tabs: Antigo e Novo Testamento).

## Validação
- Build OK.
- Prévia em /biblia: ícones com gradientes alternados nos dois testamentos.
