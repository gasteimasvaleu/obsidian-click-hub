# Padronizar o card do topo de "Minhas Criações"

Deixar o card igual ao de "Transformar Foto": título em bolha violeta e card branco preso logo abaixo.

## O que muda
- O título "Minhas Criações" vai para a bolha violeta padrão, com a última palavra em gradiente. O texto em gradiente solto sai.
- Logo abaixo fica um card branco preso à bolha, com o desenho 2D da pasta (96px) e o texto "Carregando..." ou a contagem.
- A contagem passa a usar singular ou plural: "1 criação" / "3 criações".
- A página fica com a mesma largura da Bíblia.

## Detalhes técnicos
- `src/pages/colorir/MyCreationsPage.tsx`: main vira `container mx-auto px-4 pt-16 max-w-[58rem]`. O GlassCard vira `SectionHeader title="Minhas Criações"` + `GlassCard className="-mt-4 pt-7 rounded-t-none text-center mb-6"` com `img h-24 w-24`, como em PhotoTransformPage.
