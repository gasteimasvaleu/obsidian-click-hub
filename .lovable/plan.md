# Corrigir corte na parte de baixo das capas do carrossel

- Voltar a distância entre o carrossel e os cards coloridos para como era antes.
- Deixar as capas do carrossel mais altas (cerca de 175px) e dar uma pequena folga embaixo da faixa do carrossel, para a parte de baixo das capas e os cantos arredondados aparecerem inteiros.
- O card Comunidade continua mais baixo, como no último ajuste.

## Detalhes técnicos
- `src/pages/Index.tsx`: seção de lançamentos `mb-10` → `mb-6`; viewport do Embla (`overflow-hidden`) ganha `pb-2`; imagem `h-[160px] w-[99px]` → `h-[175px] w-[108px]`, com o botão sem altura fixa (`h-auto`, `items-start`).
