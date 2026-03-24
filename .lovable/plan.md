
Objetivo: corrigir o chat do Amigo Divino aplicando de verdade a mesma lógica do Guia para os Pais.

Diagnóstico
- O erro persiste porque o chat hoje não está seguindo a lógica do Guia.
- No Guia para os Pais, os campos ficam no fluxo normal da página.
- No chat, existem 2 camadas especiais no rodapé:
  1. o menu tubelight global fixo
  2. a barra de input local com `sticky bottom-0`
- Além disso, foi adicionado um hack extra com `keyboard-open` no `body` para esconder a navbar.
- No iOS nativo, essa combinação (`fixed` global + `sticky` local + safe-area + teclado) faz a faixa preta/rodapé “subirem” junto.

O que vou ajustar
1. Remover a lógica temporária de teclado que foi adicionada só no chat
- Tirar `keyboardOpen`
- Tirar `handleFocus` / `handleBlur` que adicionam `body.keyboard-open`
- Tirar o cleanup dessa classe no `body`

2. Remover a regra global que esconde a navbar
- Apagar de `src/index.css`:
  - `body.keyboard-open .fixed.bottom-0.z-50 { display: none !important; }`

3. Reestruturar o layout do chat para ficar igual ao padrão do Guia
- Manter a página com reserva inferior fixa para o tubelight (`pb-24` / equivalente)
- Deixar o chat como coluna flex normal:
  - cabeçalho fixo no topo
  - área de mensagens com `flex-1 min-h-0 overflow-y-auto`
  - barra de input no fluxo normal da página, não `sticky`

4. Trocar o rodapé do input
- Hoje: `sticky bottom-0 ... ${keyboardOpen ? "pb-4" : "pb-28"}`
- Novo: um bloco normal no fim do layout, com padding estável, sem depender do teclado
- Isso replica o comportamento do Guia: o teclado abre, mas não “puxa” a faixa preta nem a navbar

5. Preservar o que já estava certo
- Manter `text-base` no `textarea` para evitar zoom do iOS
- Manter auto-resize do campo
- Manter scroll das mensagens

Arquivos
- `src/components/ChatInterface.tsx`
- `src/index.css`

Resultado esperado
- Ao tocar no textarea, o teclado abre sem empurrar a faixa preta
- O menu tubelight permanece com o mesmo comportamento do Guia para os Pais
- O chat continua funcional, mas sem o conflito entre `sticky`, safe-area e teclado nativo

Detalhe técnico
- O ponto principal não é “esconder o menu”, e sim parar de usar um composer com `sticky bottom-0` dentro dessa tela.
- O Guia funciona porque os inputs não criam esse segundo rodapé dinâmico.
- Então a correção certa é alinhar a estrutura do chat ao layout do Guia, não insistir no hack de `keyboard-open`.
