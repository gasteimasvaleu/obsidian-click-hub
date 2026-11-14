# Mesmo padrão em todos os avisos e janelas do app

## O que muda
Todos os avisos e janelas que aparecem para o usuário passam a seguir o mesmo padrão do aviso de Inteligência Artificial:
- **Fundo:** a tela de trás fica desfocada, em vez de preta. Isso já vale para a maioria, e passa a valer também para as confirmações, como "Excluir conta" e "Excluir anotação".
- **Tamanho no celular:** a janela fica centralizada, com margem dos lados, sem encostar nas bordas da tela.
- **Card:** cantos bem arredondados e uma borda fina violeta.
- **Título:** card bolha violeta, com a fonte padrão e a última palavra em destaque. Quando houver subtítulo, ele aparece no card branco logo abaixo.
- **Rolagem:** se o conteúdo for grande, só o meio da janela rola. O título e os botões ficam sempre visíveis.
- **Botões:** empilhados, com a mesma largura e altura. O principal fica cheio em violeta e o secundário, como "Cancelar" ou "Agora não", com contorno violeta, logo abaixo.

## Onde
Verificação dos Pais, Adicionar Nota (Bíblia), Editar Anotação e Excluir anotação, Editar nome e Excluir conta (Perfil), Alterar Avatar, detalhe do Devocional, Compartilhar Criação (Colorir) e conteúdo externo da Plataforma.

O painel administrativo continua escuro, só com os ajustes gerais.

## Detalhes técnicos
- `ui/dialog.tsx` e `ui/alert-dialog.tsx` (base de todas as janelas):
  - Content: `w-[calc(100%-2rem)] rounded-3xl border border-primary/40 max-h-[85vh] flex flex-col`.
  - Overlay do alert com o mesmo desfoque.
  - Footer: `flex-col gap-2` com botões `w-full h-11`.
  - Title: renderiza a bolha (`neon-glow-user feature-bubble bubble-user` + `border-beam` + `BubbleTitleText`).
  - Description: usa o estilo do card branco de subtítulo quando vem logo após o título.
- Em cada janela, envolver o miolo em `flex-1 min-h-0 overflow-y-auto` e passar os botões secundários para `variant="outline"` com borda violeta. Ajustar casos especiais: o Devocional e o conteúdo externo, que têm cabeçalho próprio e altura fixa, e o `AIConsentDialog`, que passa a usar a nova base.
