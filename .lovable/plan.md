
# Corrigir Scroll Horizontal no Guia para Pais

## Problema

A pagina "Guia para Pais" esta criando scroll horizontal durante o preenchimento do questionario. Isso acontece por uma combinacao de fatores:

1. A classe `neon-glow` aplica `box-shadow` que "vaza" para fora do container
2. A classe `hover:scale-105` nos cards internos expande o elemento alem dos limites do container
3. O padding `p-8` no card do formulario e muito grande para telas pequenas
4. Nao ha `overflow-x: hidden` no container da pagina
5. O `viewport-fit=cover` nao esta configurado no HTML, entao as safe areas do iOS nao sao respeitadas

## Solucao

### 1. Adicionar `viewport-fit=cover` no HTML (index.html)

Alterar a meta tag viewport para incluir `viewport-fit=cover`, habilitando o uso de `env(safe-area-inset-*)`:

```
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

### 2. Adicionar safe-area padding global no CSS (src/index.css)

No seletor `body`, adicionar paddings dinamicos para safe areas:

```css
body {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 3. Corrigir overflow na pagina GuiaPais (src/pages/GuiaPais.tsx)

Adicionar `overflow-x-hidden` no container principal da pagina.

### 4. Corrigir overflow no formulario (src/components/guia-pais/ParentsGuideForm.tsx)

- Adicionar `overflow-hidden` no container do formulario
- Reduzir padding do card de `p-8` para `p-4 sm:p-8` (menor no mobile)
- Remover `hover:scale-105` dos cards internos (steps 2, 6) que causam expansao no mobile -- ou limitar a `hover:scale-[1.02]`

### 5. Corrigir overflow no GuideDisplay (src/components/guia-pais/GuideDisplay.tsx)

- Adicionar `overflow-hidden` no container principal
- Garantir que os AccordionItems com `px-6` nao vazem

## Arquivos editados

| Arquivo | Mudanca |
|---------|---------|
| `index.html` | Adicionar `viewport-fit=cover` na meta viewport |
| `src/index.css` | Adicionar safe-area padding no body |
| `src/pages/GuiaPais.tsx` | Adicionar `overflow-x-hidden` no container |
| `src/components/guia-pais/ParentsGuideForm.tsx` | Reduzir padding mobile, remover scale excessivo, adicionar overflow-hidden |
| `src/components/guia-pais/GuideDisplay.tsx` | Adicionar overflow-hidden no container |
