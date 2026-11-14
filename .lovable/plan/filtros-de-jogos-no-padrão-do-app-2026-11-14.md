# Filtros de Jogos no padrão do app

Deixar os filtros iguais aos da página Colorir: título em bolha, e cada grupo de opções numa barra arredondada única, dividida em partes iguais.

## O que muda
- O card branco solto sai. Entra o título em bolha "Filtros", com a contagem "21 jogos encontrados" logo abaixo (singular quando for 1).
- **Tipo de Jogo**: uma barra arredondada com 5 opções lado a lado (Todos, Quiz, Memória, Caça-palavras, Quebra-cabeça), cada uma com o ícone em cima e o nome pequeno embaixo.
- **Dificuldade**: uma barra arredondada com 4 opções (Todas, Fácil, Médio, Difícil), só com o texto.
- A opção escolhida fica com fundo violeta clarinho e texto violeta. Saem o brilho neon e as cores soltas.
- Os rótulos "Tipo de Jogo" e "Dificuldade" ficam pequenos acima de cada barra.

## Detalhes técnicos
- `src/pages/Games.tsx`: trocar o `GlassCard` dos filtros por `SectionHeader title="Filtros"` com description de contagem + bloco `space-y-4`.
- Barra: `flex w-full overflow-hidden rounded-full border border-border bg-card divide-x divide-border`. Tipos: `button h-14 flex-1 flex-col text-[10px]` com ícone de 18px. Dificuldade: `button h-11 flex-1 text-xs`. Ativo: `bg-primary/10 text-primary font-semibold`.
- Remover o texto antigo de contagem, se estiver duplicado.
