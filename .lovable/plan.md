

## Corrigir navbar sendo empurrada pelo teclado no chat Amigo Divino (iOS nativo)

### Problema
No iOS nativo (Capacitor), quando o teclado virtual abre ao focar no textarea, o bottom navbar fixo (tubelight + safe area preta) é empurrado para cima junto com o teclado, causando um layout quebrado.

### Solução
Detectar quando o teclado está aberto usando a `visualViewport` API e esconder a bottom navbar durante a digitação. Também ajustar o `pb-28` do input para `pb-4` quando o teclado está visível, já que a navbar não estará mais ocupando espaço.

### Alterações em `src/components/ChatInterface.tsx`

1. Adicionar estado `keyboardOpen` que escuta `visualViewport.resize` para detectar quando o teclado está aberto (viewport height diminui significativamente)
2. Alternativamente, usar `focus`/`blur` do textarea para toggle do estado
3. Passar uma classe CSS ou esconder condicionalmente a bottom navbar (tubelight) quando `keyboardOpen` é true
4. Alterar o `pb-28` do container do input para `pb-4` quando o teclado está aberto

### Detalhes técnicos

- Usar `focus`/`blur` events no textarea para controlar o estado `keyboardOpen` (mais confiável em Capacitor)
- Quando focado: esconder a navbar adicionando `display: none` via uma classe no body ou diretamente no componente
- O tubelight navbar (`NavBar`) é renderizado globalmente no `App.tsx`, então a abordagem será aplicar uma classe no `document.body` (ex: `keyboard-open`) e usar CSS para esconder a navbar
- Adicionar regra CSS: `body.keyboard-open .fixed.bottom-0.z-50 { display: none }` em `index.css`
- Trocar `pb-28` para `pb-4` condicionalmente no container do input

