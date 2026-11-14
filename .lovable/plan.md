# Espaço entre as capas do carrossel e capa inteira

- **Capas coladas:** como o carrossel gira em loop, o espaço entre a última e a primeira capa some. Vou colocar o espaço em cada capa, assim todas ficam com a mesma distância, inclusive na volta.
- **Corte embaixo:** as capas têm formato 300x580. Vou fixar a moldura nesse formato exato, para a imagem aparecer inteira com o título visível.

## Detalhes técnicos
- `src/pages/Index.tsx`: remover `gap-3` do container Embla e usar `-ml-3` no container + `pl-3` em cada slide (padrão Embla para loop).
- Imagem: `w-[108px] aspect-[300/580] object-cover rounded-lg`; botão `h-auto shrink-0`.
