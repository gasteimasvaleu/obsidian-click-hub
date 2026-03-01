

## Corrigir Bounce da Navbar no iOS

### Problema
No iPhone real, ao fazer scroll para baixo, a navbar superior desce junto (efeito de "bounce"/elasticidade do iOS). Isso acontece porque o Safari/WebView do iOS ignora `overscroll-behavior: none` no nivel do viewport -- o rubber-banding afeta elementos `position: fixed` quando o documento inteiro faz overscroll.

### Causa Raiz
Atualmente `html` e `body` sao o container de scroll. No iOS, o scroll do viewport tem bounce nativo que nenhuma propriedade CSS consegue desabilitar completamente. Elementos `fixed` se movem junto com esse bounce.

### Solucao
Transformar `html` e `body` em containers estaticos (`overflow: hidden`, `height: 100%`) e mover o scroll para o `#root`. Dessa forma, o viewport nunca faz scroll (logo nao ha bounce), e o scroll acontece dentro de um div controlado onde `overscroll-behavior: none` funciona.

### Alteracoes

**Arquivo: `src/index.css`**

Alterar os estilos de `html`, `body` e `#root`:

```css
html {
  overflow: hidden;
  height: 100%;
  max-width: 100vw;
  background: #000000;
  overscroll-behavior: none;
}

body {
  overflow: hidden;
  height: 100%;
  max-width: 100vw;
  overscroll-behavior: none;
}

#root {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  max-width: 100vw;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: none;
}
```

### Impacto
- Apenas CSS, sem alteracao de componentes React
- Nao altera `package.json` (compativel com Appflow)
- Deploy via JS Web Build (Live Update)
- Corrige o bounce em todas as paginas, nao apenas na navbar

### Risco
Paginas que dependem de `window.scrollTo` ou `document.documentElement.scrollTop` podem precisar usar `document.getElementById('root').scrollTop` em vez disso. Sera necessario testar no dispositivo apos o deploy.
