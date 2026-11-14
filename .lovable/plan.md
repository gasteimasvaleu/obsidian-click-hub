# Ações do versículo numa barra única só com ícones

## O que muda
Os 5 botões soltos que ficam abaixo de cada versículo (Copiar, Compartilhar, Comentário, Favoritar e Nota) viram uma barra só, no mesmo estilo da barra de ações do Devocional.
- A barra é arredondada, ocupa a largura do card e tem os ícones divididos por igual, separados por linhas finas.
- Cada ícone mostra o nome da ação ao passar o mouse e é lido pelo leitor de tela.
- Comentário e Favoritar ficam em violeta quando estão ativos. A estrela fica preenchida quando o versículo está favoritado.
- Sem login, a barra mostra só Copiar, Compartilhar e Comentário, como hoje.
- Tudo continua funcionando igual.

## Detalhes técnicos
- `src/components/biblia/VerseCard.tsx`: trocar a grade de `Button` por um contêiner `flex w-full divide-x divide-border rounded-full border bg-card/60 overflow-hidden`, com um `button` de altura `h-11` em cada parte (`flex-1 flex items-center justify-center`), mais `aria-label` e `title`.
- Estado ativo: `bg-primary/10 text-primary`. Durante o carregamento do comentário, mostrar o `Loader2` girando.
