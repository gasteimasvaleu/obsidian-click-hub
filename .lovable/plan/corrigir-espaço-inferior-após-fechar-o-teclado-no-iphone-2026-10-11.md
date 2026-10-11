# Corrigir espaço inferior após fechar o teclado no iPhone

## Problema
No iPhone, ao tocar num campo de texto o teclado abre e "empurra" a tela para cima. Quando o teclado fecha, a tela não volta totalmente para o lugar, e o menu inferior fica mais alto, com um espaço maior embaixo. Hoje só a página Guia para Pais corrige isso; as outras (ex.: busca da Bíblia) não.

## Solução
Aplicar a correção em todo o app, de uma vez só:
- Quando um campo de texto perde o foco (teclado fecha), aguardar um instante e, se nenhum outro campo estiver em foco, voltar a tela para a posição original.
- Fazer o mesmo quando a área visível do iPhone volta ao tamanho normal (sinal de que o teclado sumiu).
- Remover a correção duplicada da página Guia para Pais, já que passa a valer para todas.

## Detalhes técnicos
- Novo hook `useIOSKeyboardReset` montado uma vez em `App.tsx`: listeners `focusout` (com `setTimeout` ~100ms checando `document.activeElement`) e `visualViewport.resize` (quando a altura volta perto de `window.innerHeight`), chamando `window.scrollTo(0,0)`, `document.documentElement.scrollTop = 0` e `document.body.scrollTop = 0`. Não altera o scroll do `#root` (rolagem do conteúdo é preservada).
- Remover o listener `focusout` de `src/pages/GuiaPais.tsx`.
- Só código web: chega pelo live update, sem novo build.
