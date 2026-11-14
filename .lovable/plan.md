# Desenhos coloridos no lugar dos ícones dos cards da tela inicial

Trocar os ícones de linha dos 9 cards de atalho por desenhos coloridos sem fundo, no mesmo estilo cartoon do painel "Mais".

## O que muda
- Os desenhos já feitos para o painel "Mais" são reaproveitados em: Devocional, Orações, Bíbliafy, Colorir, Amigo Divino, Games e Comunidade.
- Faltam dois desenhos novos, no mesmo estilo: **Bíblia Interativa** (Bíblia aberta com brilho) e **Guia para Pais** (pai, mãe e criança juntos).
- O desenho fica um pouco maior que o ícone atual (cerca de 40px), com uma leve sombra para destacar do fundo colorido. Texto, seta, efeito bolha e brilho continuam iguais.
- Você pode trocar qualquer desenho depois.

## Detalhes técnicos
- Gerar `src/assets/more-menu/biblia.png` e `guia-pais.png` (fundo transparente).
- `src/pages/Index.tsx`: trocar `icon` por `image` em `featureActions` e renderizar `<img className="h-10 w-10 object-contain drop-shadow" alt="">`; remover imports de lucide que deixarem de ser usados.
