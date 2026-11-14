# Termos de Uso no padrão do app

Mesmo tratamento da Política de Famílias: títulos em bolha violeta, card branco preso embaixo e nenhum ícone ocupando linha sozinho.

## O que muda
- **Topo**: o ícone grande de documento sai. Fica a bolha "Termos de Uso (EULA)", e o card embaixo junta a descrição e o parágrafo de aceite. Hoje são dois cards separados.
- **As 7 seções** (Descrição do Serviço, Assinatura e Pagamento, Renovação Automática, Cancelamento, Contato e Suporte, Uso Aceitável, Alterações nos Termos): cada uma vira bolha com o título e o texto no card. Os quadradinhos de ícone saem.
- **E-mail de suporte**: fica clicável, tanto em "Contato e Suporte" quanto no rodapé.
- **Rodapé** (última atualização e contato): vira um texto pequeno centralizado, sem card.
- A página passa a ter a mesma largura da Bíblia.
- Os textos legais não mudam.

## Detalhes técnicos
- `src/pages/TermosDeUso.tsx`: juntar todas as seções num único array, renderizado com `BubbleSection` (h1 no topo, h2 nas seções). Container `px-4 pt-20 max-w-[58rem]`. Remover `GlassCard`, `Button` e os ícones lucide. Fazer `mailto:` no e-mail dentro do texto de contato.
