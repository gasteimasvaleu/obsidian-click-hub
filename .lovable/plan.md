# Descrição dos módulos ocupando a altura da imagem

## O que muda
Na lista de módulos da página do curso, a descrição deixa de cortar em 2 linhas. Ela passa a mostrar quantas linhas couberem até a altura da imagem em pé à esquerda.

Se o texto for maior que isso, ele termina com "…" bem na base da imagem.

## Detalhes técnicos
- `ModulePlaylist.tsx`: a coluna de texto fica com a mesma altura da miniatura (`self-stretch` + `flex flex-col`). A descrição usa `flex-1 overflow-hidden`.
- Limite de linhas compatível com a altura da miniatura: `line-clamp-7` no celular, onde a miniatura tem cerca de 186px, e `line-clamp-[10]` no desktop, onde tem cerca de 248px. Assim o "…" aparece na última linha visível, sem cortar uma linha pela metade.
