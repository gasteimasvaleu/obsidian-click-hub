

# Restaurar "Amigo Divino" na navbar tubelight

## Alteracao

**Arquivo:** `src/App.tsx`

Substituir o item "Colorir" pelo "Amigo Divino" no array `navItems`.

### De:
```typescript
{ name: 'Colorir', url: '/colorir', icon: Palette }
```

### Para:
```typescript
{ name: 'Amigo Divino', url: '/amigodivino', icon: MessageCircle }
```

O icone `MessageCircle` ja esta importado no arquivo. O import de `Palette` pode ser removido dos imports do `navItems` (mas deve ser mantido se usado em outro lugar do arquivo -- neste caso nao e usado em mais nenhum lugar do App.tsx, entao pode ser removido).

A pagina Colorir continua acessivel normalmente pela pagina inicial (Index) e pela rota `/colorir`, apenas nao aparecera mais na barra de navegacao inferior.

