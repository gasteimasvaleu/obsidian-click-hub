

# Corrigir gap da navbar ao voltar do scroll no iOS

## Problema
No iOS Safari, ao rolar para baixo e voltar ao topo, o efeito de "rubber-band" (overscroll elastico) causa um deslocamento na navbar, criando um espaco visivel entre a barra de status e a navbar.

## Solucao
Desabilitar o overscroll bounce no iOS adicionando `overscroll-behavior: none` nos elementos `html` e `body` no CSS. Isso elimina o efeito elastico que desloca a navbar.

## Detalhe tecnico

**Arquivo:** `src/index.css`

1. No seletor `html` (aprox. linha 86), adicionar:
```css
overscroll-behavior: none;
```

2. No primeiro seletor `body` (aprox. linha 81), adicionar:
```css
overscroll-behavior: none;
```

Isso impede o Safari de fazer o bounce elastico ao chegar no topo/fundo da pagina, mantendo a navbar sempre na posicao correta.

