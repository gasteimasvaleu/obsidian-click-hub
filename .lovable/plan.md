# Corrigir o corte da descrição dos módulos

## O que deu errado
O limite de 7 linhas que coloquei no celular não existe na configuração de estilos do app. Por isso ele foi ignorado: o texto aparece inteiro e passa da altura da imagem, sem o "…".

## Correção
A descrição para exatamente na altura da imagem à esquerda e termina com "…".

## Detalhes técnicos
- `ModulePlaylist.tsx`: trocar `line-clamp-7` por `line-clamp-[7]` (valor arbitrário, que o Tailwind 3.4 aceita). O `md:line-clamp-[10]` fica como está.
- Fixar `leading-5` (20px) na descrição para o cálculo bater: título (~24px) + 7 × 20px ≈ 186px, a altura da miniatura no celular.
- Conferir no navegador, em 393px de largura, que a última linha termina em "…" na base da imagem.
