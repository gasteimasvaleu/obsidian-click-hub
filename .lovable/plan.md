# Botões de sugestão do Estudo Bíblico no padrão do app

Abaixo das respostas, as sugestões soltas e o botão de revisão viram um bloco no padrão das outras telas:

- As 3 sugestões ficam numa barra arredondada com divisórias (como os filtros), com ícone e texto curto embaixo, h-14:
  - "Mais simples" (ícone de lâmpada)
  - "Exemplo" (ícone de livro aberto)
  - "No dia a dia" (ícone de coração)
  Ao tocar, cada uma envia a frase completa, como hoje.
- "Revisar com perguntinhas" vira o botão violeta de setinhas animadas (o mesmo do "Começar estudo"), com a largura toda.

## Detalhes técnicos
- src/pages/estudo/EstudoChatPage.tsx: SUGESTOES passa a ter {label, prompt, icon}; usar SPLIT_BAR com botões `flex h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px]`; revisão com ArrowNavButton direction="right" (desabilitado e com label "Preparando perguntas..." enquanto carrega).
