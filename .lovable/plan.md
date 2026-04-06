

## Bug: Padding superior excessivo na página Amigo Divino

### Problema
A página `AmigoDivino.tsx` tem `min-h-screen` aplicado **duas vezes** — no wrapper externo (linha 11) e no div interno (linha 14). O div interno também usa `flex items-center justify-center`, que centraliza verticalmente o conteúdo dentro de uma viewport inteira, somado ao `pt-16` da navbar. Isso cria um padding superior visivelmente maior que nas outras páginas (como Index, que usa apenas `pt-20` sem centralização vertical dupla).

### Correção (1 arquivo)

**`src/pages/AmigoDivino.tsx`** — Remover o `min-h-screen` e a centralização vertical do div interno (linha 14), e usar o mesmo padrão das outras páginas:

- Trocar `<div className="flex items-center justify-center min-h-screen pt-16 px-4">` por `<div className="pt-20 px-4">`
- Isso alinha o comportamento com as demais páginas, mantendo apenas o espaçamento necessário para a navbar fixa

