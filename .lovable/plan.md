# Política de Famílias no padrão do app

Mesmo tratamento da página Sobre: títulos em bolha violeta, card branco preso embaixo e nenhum ícone ocupando linha sozinho.

## O que muda
- **Topo**: o escudo grande sai. Fica a bolha "Política de Famílias e Privacidade", com a descrição no card embaixo.
- **As 5 seções** (Conteúdo para Crianças, Privacidade e Dados, Sem Anúncios, Supervisão dos Pais, Conformidade com Políticas): cada uma vira bolha com o título e o texto no card. Os quadradinhos de ícone saem.
- **Rodapé** (última atualização e contato): vira um texto pequeno centralizado, sem card. O e-mail fica clicável.
- A página passa a ter a mesma largura da Bíblia.

## Observação de conteúdo
- A página ainda diz "Bíblia Toon Kids". Pela troca de nome do app, proponho usar "BíbliaToon Club" nos textos. O e-mail de suporte não muda.

## Detalhes técnicos
- `src/pages/PoliticaFamilia.tsx`: usar `BubbleSection` (h1 no topo, h2 nas seções), container `px-4 pt-20 max-w-[58rem]`, remover o `GlassCard`, o `Button` e os ícones lucide sem uso, e usar `mailto:` no e-mail.
