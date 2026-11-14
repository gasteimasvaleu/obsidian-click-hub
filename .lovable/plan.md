# Guia para Pais alinhado no computador e no iPad

## O que está errado
No computador e no iPad, o vídeo ocupa a coluna inteira, mas o título, a barra de progresso e o card das perguntas ficam mais estreitos. A área do formulário encolhe até o tamanho do próprio conteúdo, em vez de acompanhar a largura do vídeo.

## Correção
Tudo na página fica numa única coluna centralizada, com a mesma largura do vídeo: título, progresso, perguntas e, depois de gerar, o guia pronto.

No celular nada muda.

## Detalhes técnicos
- `ParentsGuideForm.tsx`: o contêiner raiz ganha `w-full`, ficando `w-full max-w-2xl mx-auto animate-fade-in`.
- `GuiaPais.tsx`: envolver `GuideDisplay` em `<div className="w-full max-w-2xl mx-auto">` para o guia gerado ter a mesma largura.
