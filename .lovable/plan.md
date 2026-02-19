
# Desfazer apenas as mudanças de Safe Area

Vou reverter somente as 3 alteracoes de safe area, sem afetar a remocao do modal PWA.

## Mudancas

### 1. `index.html` (linha 5)
Remover `viewport-fit=cover` do meta viewport:

**De:** `width=device-width, initial-scale=1.0, viewport-fit=cover`
**Para:** `width=device-width, initial-scale=1.0`

### 2. `src/index.css` (linhas 99-102 e 126-130)
- Remover `background: #000000;` do `html`
- Restaurar `.navbar-glass` para o original:

**De:**
```css
.navbar-glass {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding-top: env(safe-area-inset-top, 0px);
}
```

**Para:**
```css
.navbar-glass {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding-top: env(safe-area-inset-top, 0px);
}
```

Na verdade, o `.navbar-glass` original (antes das mudancas de safe area) era:
```css
.navbar-glass {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

Entao restaurar para essa versao (sem padding-top e com opacidade 0.4).

- Remover `background: #000000;` do bloco `html`

### 3. `src/components/ui/tubelight-navbar.tsx` (linha 48)
Remover o `paddingBottom: env(safe-area-inset-bottom)` do style inline.

**De:**
```tsx
style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
```

**Para:** remover o atributo `style` completamente.

## Resumo

| Arquivo | O que muda |
|---------|-----------|
| `index.html` | Remove `viewport-fit=cover` |
| `src/index.css` | Remove `background: #000000` do html; restaura navbar-glass para opacidade 0.4 sem padding-top |
| `tubelight-navbar.tsx` | Remove paddingBottom inline |

A remocao do modal PWA permanece intacta.
