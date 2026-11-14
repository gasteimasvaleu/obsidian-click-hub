# Filtros do histórico de devocionais no padrão do app

Na aba "Devocionais" do Perfil, os botões soltos (Todos, Semana, Mês, Ano, Com anotações) passam a seguir o mesmo padrão dos filtros de Jogos:

- Barra única arredondada, com divisórias, para o período: Todos | Semana | Mês | Ano (h-11). A opção ativa fica em violeta suave.
- "Com anotações" vira um botão de alternância logo abaixo, na mesma barra arredondada e com a largura toda, usando o ícone de anotação. Fica violeta quando ligado.
- O comportamento dos filtros não muda.

## Detalhes técnicos
- Arquivo: src/components/profile/DevotionalHistoryTab.tsx.
- Usar SPLIT_BAR de src/components/ui/bubble-section.tsx; ativo: bg-primary/10 text-primary font-semibold.
- Remover o import de Button se ele não for mais usado.
