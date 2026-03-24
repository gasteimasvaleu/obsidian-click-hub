

## Corrigir teclado iOS + visual card no chat Amigo Divino

### Problema real
O Guia para os Pais funciona porque é uma página com scroll normal (`min-h-screen pb-24`) -- sem elementos `fixed` próprios. O teclado do iOS não interfere porque não há nada fixo para empurrar.

No chat, o tubelight navbar global (`fixed bottom-0`) continua presente na rota `/amigodivino/chat`. Quando o teclado abre, o iOS empurra esse elemento fixo junto com a faixa preta de safe-area. Nenhuma mudança na estrutura interna do chat resolve isso enquanto o tubelight continuar renderizando nessa rota.

### Solução

**1. Esconder o tubelight navbar na rota do chat**
- `src/App.tsx`: adicionar `/amigodivino/chat` em `hiddenNavBarRoutes`
- Isso remove o único elemento `fixed bottom-0` que o iOS está empurrando

**2. Reestruturar o chat como página scrollável (igual ao Guia)**
- `src/components/ChatInterface.tsx`: trocar `h-screen flex flex-col overflow-hidden` por `min-h-screen relative` com scroll no `#root`
- O composer fica no fluxo normal da página, não `sticky` nem `fixed`
- Padding inferior baseado em `env(safe-area-inset-bottom)` em vez de `pb-24`

**3. Visual: envolver a area de chat em um card com border-radius**
- Adicionar um container glass/card com `rounded-2xl` e borda sutil ao redor da area de mensagens + composer
- Margem lateral `mx-3` para dar respiro visual
- O sub-header fica fora do card, mantendo o layout limpo

### Arquivos alterados
- `src/App.tsx` (1 linha: adicionar rota ao array)
- `src/components/ChatInterface.tsx` (reestruturar layout + adicionar card visual)

