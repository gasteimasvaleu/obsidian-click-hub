# Mostrar as capas do carrossel inteiras

O corte vem do recorte automático da imagem: as capas são mais altas do que a moldura, então o título embaixo ("O Amigo Fiel", "Lázaro e O Rico") fica de fora.

- Cada capa passa a aparecer no seu formato original, inteira, com a mesma largura de agora. A altura se ajusta sozinha à imagem, sem cortar nada.

## Detalhes técnicos
- `src/pages/Index.tsx`: imagem do carrossel `h-[175px] w-[108px] object-cover` → `h-auto w-[108px] object-contain` (sem altura fixa).
