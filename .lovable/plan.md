
# Corrigir navbar atrás da status bar do iOS

## Problema
A navbar superior ("BibliaToonKIDS" + icones) usa `fixed top-0`, ficando por baixo do relogio, sinal e bateria do iPhone. O conteudo se sobrepoem.

## Solucao

Duas mudancas simples:

### 1. `index.html` -- Habilitar viewport-fit=cover
Adicionar `viewport-fit=cover` na meta tag viewport. Isso faz o app ocupar toda a tela e disponibiliza os valores de safe area via CSS.

```
Antes:  width=device-width, initial-scale=1.0
Depois: width=device-width, initial-scale=1.0, viewport-fit=cover
```

### 2. `src/components/FuturisticNavbar.tsx` -- Respeitar safe area no topo
Adicionar `padding-top: env(safe-area-inset-top)` inline na nav, empurrando o conteudo para baixo da status bar do iOS.

### 3. `src/index.css` -- Travar overflow do app
Adicionar `overflow: hidden` e `position: fixed` no `html` e `body`, e permitir scroll apenas no `#root`. Isso evita que o conteudo "estoure" a tela horizontalmente ou verticalmente no app nativo.

```css
html, body {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}

#root {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  -webkit-overflow-scrolling: touch;
}
```

## O que NAO muda
- Bottom navbar (tubelight) -- voce disse que esta OK
- Splash screen -- sem alteracao
- Admin header -- so afeta o app nativo e o admin nao e acessado pelo app

## Observacao
- `env(safe-area-inset-top)` e ignorado em browsers normais sem notch, entao nao quebra a versao web
- Apos implementar, sera necessario rodar `npx cap sync` e rebuildar o app para testar no dispositivo
