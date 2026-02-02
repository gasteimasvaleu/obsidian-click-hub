

## Adicionar Setas de Navegação nos Carrosséis Mobile

### Problema Identificado

As setas de navegação (anterior/próximo) não aparecem em alguns carrosséis no mobile porque a condição atual (`items.length > 3`) não considera que:
- No mobile: cabem apenas **2 itens** na tela (basis-1/2)
- No desktop: cabem **5 itens** na tela (basis-1/5)

Carrosséis como "Aprendendo a Rezar", "Clube dos Pequenos", "Animes", "Bíblia Falada" podem ter poucos módulos, fazendo as setas não aparecerem.

### Solução

Alterar a lógica para sempre mostrar as setas quando houver **2 ou mais itens**, já que no mobile 2 itens já ultrapassam a tela.

### Alteração Técnica

**Arquivo:** `src/components/plataforma/CourseCarousel.tsx`

**Antes:**
```tsx
{items.length > 3 && (
  <>
    <CarouselPrevious className="flex left-1 md:-left-4" />
    <CarouselNext className="flex right-1 md:-right-4" />
  </>
)}
```

**Depois:**
```tsx
{items.length > 1 && (
  <>
    <CarouselPrevious className="flex left-1 md:-left-4" />
    <CarouselNext className="flex right-1 md:-right-4" />
  </>
)}
```

### Lógica Complementar

Também ajustar a opção de `loop` do Embla Carousel para ser consistente:

**Antes:**
```tsx
opts={{
  align: "start",
  loop: items.length > 3,
}}
```

**Depois:**
```tsx
opts={{
  align: "start",
  loop: items.length > 2,
}}
```

### Comportamento Após a Correção

| Qtd de Itens | Mobile (2 visíveis) | Desktop (5 visíveis) |
|--------------|---------------------|----------------------|
| 1 item       | Sem setas           | Sem setas            |
| 2 itens      | Com setas           | Com setas (disabled) |
| 3+ itens     | Com setas           | Com setas            |

As setas ficam automaticamente desabilitadas quando não há mais conteúdo para scrollar (comportamento nativo do Embla via `canScrollPrev`/`canScrollNext`).

