

# Ajustar layout dos botoes de categoria (Colorir)

Os botoes de categoria na pagina Colorir usam `flex flex-wrap gap-2`, ficando lado a lado sem ocupar todo o espaco horizontal.

## Mudanca

Em `src/components/colorir/CategoryFilter.tsx`, linha 20, trocar:

```
<div className="flex flex-wrap gap-2">
```

por:

```
<div className="grid grid-cols-2 gap-2">
```

E adicionar `w-full` aos botoes (linha 27) para que preencham toda a celula do grid:

```
className={`w-full transition-all duration-300 active:scale-95 group ${
```

Isso faz os 4 botoes (Todos, Contos, Parabolas, Personagens) ficarem organizados em 2 por linha, ocupando todo o espaco horizontal.

