
## Corrigir de vez o layout do chat no iPhone

### Do I know what the issue is?
Sim.

### O problema exato
O chat está quebrando por uma combinação de 4 coisas:

1. **Existe uma navbar fixa no topo dentro do próprio chat** (`FuturisticNavbar`), mas o layout também tenta usar a tela inteira com `h-screen`. Na prática, isso consome altura sem o card compensar corretamente.
2. **Há scroll em mais de um lugar**: o app já usa `#root` com scroll, e o chat também usa `overflow-y-auto`. No iOS isso costuma gerar efeito de “subir tudo” e bagunçar o viewport.
3. **O chat depende de `h-screen/100vh`**, que no iPhone não acompanha bem a abertura do teclado.
4. **`scrollIntoView` está sendo usado ao chegar mensagem**, e no iOS isso pode puxar o viewport inteiro em vez de rolar só a lista de mensagens.

As screenshots confirmam isso: o composer já nasce parcialmente fora da tela e, quando o teclado abre, o viewport inteiro desloca.

### Abordagem correta
Vou tratar o chat como uma **tela isolada e fixa**, sem scroll da página, e com **scroll apenas na lista de mensagens**.

### O que implementar

#### 1. Remover a navbar global visual do topo dentro do chat
**Arquivo:** `src/components/ChatInterface.tsx`

- Remover o `FuturisticNavbar` dessa tela.
- Manter apenas o header verde do próprio chat como topo da interface.

Isso elimina a principal altura “fantasma” que hoje empurra o card para baixo.

#### 2. Travar a tela do chat como viewport fixa real
**Arquivos:** `src/components/ChatInterface.tsx`, possivelmente `src/index.css`

- Trocar o container principal para um layout **fixo ao viewport** (`fixed inset-0` ou equivalente), em vez de depender de `h-screen` solto dentro de uma página scrollável.
- Aplicar altura baseada no viewport visível real do aparelho.
- Garantir `overflow-hidden` no container da tela inteira.

Objetivo: o chat vira uma “camada fechada”, que não sobe nem desce quando o usuário toca no input.

#### 3. Desabilitar scroll da página enquanto essa rota estiver montada
**Arquivo:** `src/components/ChatInterface.tsx`

- No mount da rota `/amigodivino/chat`, bloquear o scroll de `html`, `body` e `#root`.
- No unmount, restaurar o comportamento anterior.

Isso evita o conflito entre scroll global do app e scroll interno do chat.

#### 4. Deixar scroll somente na área de mensagens
**Arquivo:** `src/components/ChatInterface.tsx`

- Header verde: fixo no topo do card.
- Composer branco: fixo no rodapé do card.
- Área de mensagens: único elemento com `overflow-y-auto`, `flex-1`, `min-h-0`.

Resultado esperado:
- a página não rola;
- o chat não sai do lugar;
- só as mensagens rolam.

#### 5. Parar de usar `scrollIntoView` para rolar o chat
**Arquivo:** `src/components/ChatInterface.tsx`

- Substituir o `scrollRef.current.scrollIntoView(...)` por rolagem direta no container de mensagens (`scrollTop = scrollHeight`).
- Fazer isso apenas no scroller interno das mensagens.

Isso evita que o iPhone tente reposicionar a viewport inteira.

#### 6. Ajustar para teclado iOS com `visualViewport`
**Arquivo:** `src/components/ChatInterface.tsx`

- Criar um efeito que leia `window.visualViewport.height` e atualize a altura real disponível do chat.
- Recalcular quando o teclado abrir/fechar (`resize` / `scroll` do `visualViewport`).
- Usar essa altura no container fixo do chat.

Isso corrige o comportamento que `100vh/h-screen` sozinho não resolve no Safari/iOS.

#### 7. Preservar safe areas sem criar espaço morto
**Arquivo:** `src/components/ChatInterface.tsx`

- Aplicar safe-area apenas onde faz sentido:
  - topo no header;
  - base no composer.
- Remover paddings extras que hoje estão somando altura demais.

Assim o card ocupa mais área útil sem empurrar o textarea para fora da tela.

### Arquivos a ajustar
- `src/components/ChatInterface.tsx` — principal correção estrutural
- `src/index.css` — apenas se eu precisar de uma classe utilitária para travar scroll do app nessa rota

### Resultado esperado
- o chat abre já encaixado corretamente;
- o composer fica sempre visível;
- o teclado não “desmonta” a tela;
- a página não sobe;
- apenas a conversa rola, como um app de chat de verdade.
