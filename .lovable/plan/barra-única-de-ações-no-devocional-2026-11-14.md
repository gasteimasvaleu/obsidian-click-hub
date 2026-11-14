# Barra única de ações no Devocional

## O que muda
Os 3 botões soltos ("Marcar como Lido", "Compartilhar" e "Salvar em PDF") dão lugar a uma única barra violeta em estilo bolha, com borda luminosa e largura total. Ela fica dividida em 3 partes iguais, separadas por linhas finas translúcidas.

Cada parte tem um ícone branco com um rótulo curto embaixo:
- **Lido:** ícone de check. Depois de marcar, o check fica preenchido e o rótulo vira "Concluído", sem clique. Para quem não está logado, esse item não aparece e a barra fica com 2 partes.
- **Compartilhar:** ícone de compartilhar.
- **PDF:** ícone de download.

Ao tocar, cada parte escurece levemente, igual aos outros cards violeta. As funções continuam as mesmas.

## Detalhes técnicos
- `DailyDevotionalPage.tsx`, linhas 478–505: trocar o `flex-wrap` por `<div className="neon-glow-user feature-bubble bubble-user relative rounded-2xl mb-6 grid divide-x divide-primary-foreground/25" style={{gridTemplateColumns: repeat(n,1fr)}}>` com `border-beam`.
- Cada item é um `<button>` com `flex flex-col items-center gap-1 py-3 text-primary-foreground text-xs font-semibold` e `aria-label`. Usa os ícones `CheckCircle2`, `Share2` e `FileDown`, que já estão importados, em 22px.
- Quando concluído, o item mostra `CheckCircle2` com `fill-primary-foreground/30`, fica `disabled` e tem o rótulo "Concluído".
- Removo as cores verdes fixas e uso só os tokens do tema.
