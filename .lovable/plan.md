
Objetivo: alinhar o chat do Amigo Divino ao mesmo padrão estrutural do Guia para os Pais, em vez de continuar tentando “corrigir” com hacks de teclado.

Diagnóstico
- O problema não é o textarea em si.
- O chat ainda está com uma estrutura diferente do Guia:
  - header superior fixo
  - conteúdo solto na página
  - input no fim de um layout que não está organizado como coluna com área rolável dedicada
- No iOS nativo, quando o foco entra no textarea, o sistema tenta reposicionar a viewport. Como o chat não está montado como o Guia, a área preta + tubelight acabam sendo empurradas visualmente.

O que vou ajustar
1. Reestruturar `src/components/ChatInterface.tsx` para virar um layout em coluna real
- container principal com altura estável da viewport
- bloco interno com `flex flex-col`
- área de mensagens com `flex-1 min-h-0 overflow-y-auto`
- barra de input como bloco fixo no fluxo desse layout, não como parte solta da página

2. Aplicar a mesma lógica do Guia na distribuição dos espaços
- manter o topo reservado para a navbar/header
- manter a reserva inferior para o tubelight
- colocar o scroll apenas na área das mensagens, não no layout inteiro da tela

3. Parar de depender de qualquer comportamento “global” para teclado
- não usar esconder navbar
- não usar classe no `body`
- não usar compensações dinâmicas de padding ao focar

4. Ajustar o composer do chat
- deixar o input ancorado no fim da coluna
- garantir `shrink-0`
- manter `text-base` no textarea
- preservar auto-resize e envio por Enter

Arquivos
- `src/components/ChatInterface.tsx`
- revisão mínima em `src/index.css` apenas se houver alguma regra global interferindo no scroll/altura dessa tela

Resultado esperado
- ao tocar no textarea, o teclado abre sem “subir” a faixa preta e o tubelight
- o chat passa a se comportar como o Guia para os Pais
- mensagens continuam rolando normalmente e o campo continua estável durante a digitação

Detalhe técnico
- a correção certa aqui é estrutural: transformar o chat em uma tela com “header + messages scroller + composer”.
- enquanto o chat continuar fora desse padrão, o iOS vai continuar reposicionando a viewport de forma errada.
