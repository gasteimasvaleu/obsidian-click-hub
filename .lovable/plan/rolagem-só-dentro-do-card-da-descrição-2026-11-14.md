# Rolagem só dentro do card da descrição

No player completo, a janela fica parada: seta, ondas sonoras, título, barra de tempo e botões ficam fixos, e só o texto da descrição rola dentro do próprio card branco (igual ao aviso de Inteligência Artificial). Com isso o "Ver mais" deixa de ser necessário: o texto aparece inteiro e rola dentro do card.

## Detalhes técnicos
- `AudioPlayer.tsx`: painel sem `overflow-y-auto`; blocos de topo com `shrink-0`; card da descrição `flex-1 min-h-0 overflow-y-auto` (sem `line-clamp` e sem o botão Ver mais).
