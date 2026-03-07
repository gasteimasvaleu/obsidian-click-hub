

# Remover barra de scroll cinza global

Adicionar ocultação de scrollbar no `#root` em `src/index.css`, mantendo a rolagem funcional.

## Alteração

**`src/index.css`** — no bloco `#root` (linhas ~118-125), adicionar:
- `scrollbar-width: none;` (Firefox)
- `-ms-overflow-style: none;` (IE/Edge)

E após o bloco, adicionar:
```css
#root::-webkit-scrollbar {
    display: none;
}
```

