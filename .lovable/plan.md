

# Corrigir areas cinzas nas safe areas do iOS (status bar e home indicator)

## Problema

As areas cinzas que aparecem acima da navbar e abaixo do menu tubelight sao as **safe areas do iOS** -- a area da barra de status (hora, bateria) e a area do home indicator. O WebView do Capacitor esta mostrando essas areas com cor cinza/transparente em vez de preto.

## Causa

Tres fatores contribuem para isso:

1. O `theme-color` no HTML esta como `#00ff00` (verde), que influencia a cor dessas areas
2. O `apple-mobile-web-app-status-bar-style` esta como `black-translucent`, que deixa a area translucida (cinza)
3. O elemento `html` nao tem `background-color` definido -- apenas o `body` tem `#000000`. As safe areas podem mostrar o fundo do `html`
4. O `capacitor.config.ts` nao define `backgroundColor` para o iOS, entao o WebView usa o padrao (branco/cinza)

## Solucao

### 1. `index.html` -- Meta tags

- Mudar `theme-color` de `#00ff00` para `#000000`
- Mudar `apple-mobile-web-app-status-bar-style` de `black-translucent` para `black`

### 2. `src/index.css` -- Background do html

Adicionar `background: #000000;` ao seletor `html` existente:

```css
html {
  overflow-x: hidden;
  max-width: 100vw;
  background: #000000;
}
```

### 3. `capacitor.config.ts` -- Background nativo do WebView

Adicionar `backgroundColor: '#000000'` na configuracao iOS:

```typescript
ios: {
  contentInset: 'always',
  backgroundColor: '#000000',
},
```

## Resumo

| Arquivo | Mudanca |
|---------|---------|
| `index.html` | theme-color para #000000, status-bar-style para "black" |
| `src/index.css` | background: #000000 no html |
| `capacitor.config.ts` | backgroundColor: '#000000' no iOS |

Nota: a mudanca no `capacitor.config.ts` requer rebuild nativo (rodar `npx cap sync` e recompilar no Xcode). As outras mudancas via web (index.html e CSS) serao aplicadas pelo Live Update automaticamente.

