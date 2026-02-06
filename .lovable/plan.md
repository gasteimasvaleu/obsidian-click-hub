

# Trocar "Amigo Divino" por "Guia para Pais" na navbar

## Alteracao

**Arquivo:** `src/App.tsx`

Substituir o item "Amigo Divino" pelo "Guia para Pais" no array `navItems`.

### De:
```typescript
{ name: 'Amigo Divino', url: '/amigodivino', icon: MessageCircle }
```

### Para:
```typescript
{ name: 'Guia para Pais', url: '/guia-pais', icon: Users }
```

O icone `Users` ja esta importado no arquivo. O icone `MessageCircle` tambem sera mantido pois e usado em outras partes do app.

A pagina Amigo Divino continua acessivel pela pagina inicial (Index) e pela rota `/amigodivino`.

