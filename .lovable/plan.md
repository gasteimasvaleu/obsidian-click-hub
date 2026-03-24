
## Mudar o chat do Amigo Divino para modal na própria página

### Diagnóstico
Sim, a melhor saída aqui é transformar o chat em um modal/overlay aberto dentro da página `AmigoDivino`, em vez de navegar para `/amigodivino/chat`.

Hoje o problema estrutural é este:
- `ChatInterface` altera `html`, `body` e `#root` para travar scroll
- ao sair da rota, o restore desses estilos está deixando efeitos colaterais no app
- isso empurra a página e a navbar para baixo depois do retorno
- como iPhone + teclado + `visualViewport` + troca de rota é uma combinação frágil, insistir nessa arquitetura tende a continuar quebrando

### Nova abordagem
Ao clicar em **Começar Jornada**, a página `AmigoDivino` continua montada e o chat abre como um **overlay modal full-screen** por cima dela, com o mesmo visual atual:
- card com `rounded-2xl`
- header verde
- área de mensagens scrollável
- composer branco fixo na base
- fundo escurecido atrás

Assim:
- não existe navegação para outra rota
- a navbar global não entra em conflito
- o conteúdo da página de fundo não é “empurrado”
- o chat continua com aparência de card

### O que vou implementar

#### 1. Abrir o chat por estado local em `AmigoDivino`
**Arquivo:** `src/pages/AmigoDivino.tsx`

- trocar `navigate('/amigodivino/chat')` por algo como `setIsChatOpen(true)`
- renderizar o chat condicionalmente como overlay
- manter botão de fechar/voltar dentro do próprio modal

#### 2. Adaptar `ChatInterface` para funcionar como modal controlado
**Arquivo:** `src/components/ChatInterface.tsx`

- remover dependência de navegação como fluxo principal
- receber props como:
  - `open`
  - `onClose`
- manter layout fixo dentro do overlay, mas sem depender da troca de rota
- preservar bordas arredondadas e o visual de card

#### 3. Parar de mexer globalmente em `body`/`html` da forma atual
**Arquivo:** `src/components/ChatInterface.tsx`

- substituir a estratégia atual de travar `body`, `html` e `#root`
- usar uma abordagem mais contida:
  - overlay `fixed inset-0`
  - fundo escurecido
  - conteúdo do chat isolado
- se ainda for necessário lock de scroll, aplicar de forma mínima e segura enquanto o modal estiver aberto, sem alterar posicionamento do `body`

#### 4. Manter estabilidade no iPhone
**Arquivo:** `src/components/ChatInterface.tsx`

- preservar o uso de `visualViewport` para altura real quando teclado abrir
- manter scroll apenas na área de mensagens
- manter auto-scroll com `scrollTop`, não `scrollIntoView`

#### 5. Restaurar o visual correto
**Arquivo:** `src/components/ChatInterface.tsx`

- manter `rounded-2xl`
- manter borda sutil e sombra
- header verde e composer branco dentro do card
- safe areas aplicadas sem gerar espaços exagerados

#### 6. Limpar a arquitetura antiga baseada em rota
**Arquivo:** `src/App.tsx`

- remover a rota `/amigodivino/chat` do fluxo principal
- remover `/amigodivino/chat` de `hiddenNavBarRoutes` se ele deixar de ser usado
- garantir que o Amigo Divino volte a funcionar como página normal + modal

### Resultado esperado
- clicar em **Começar Jornada** abre o chat sobre a tela atual
- fechar o chat volta instantaneamente para a página `AmigoDivino`
- navbar não é empurrada
- conteúdo da página não desce
- teclado não desmonta a interface
- o chat mantém as bordas arredondadas e o visual bonito

### Detalhe técnico
Estrutura alvo:
```text
AmigoDivino page
└── botão "Começar Jornada"
    └── abre estado local
        └── overlay fixed inset-0
            ├── backdrop escuro
            └── chat card rounded-2xl
                ├── header
                ├── messages scroller
                └── composer
```
