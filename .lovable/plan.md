

# Atualizar categorias do filtro na pagina Colorir

## Alteracao

**Arquivo:** `src/components/colorir/CategoryFilter.tsx`

Substituir as categorias atuais:
- Todos, Antigo Test., Novo Test., Personagens, Animais

Pelas novas categorias:
- Todos, Contos, Parabolas, Personagens

### Detalhes tecnicos

Atualizar o array `categories` no componente `CategoryFilter`:

```typescript
const categories = [
  { value: 'all', label: 'Todos', icon: Palette },
  { value: 'contos', label: 'Contos', icon: BookOpen },
  { value: 'parabolas', label: 'Parabolas', icon: Sparkles },
  { value: 'personagens', label: 'Personagens', icon: Cross },
];
```

- Remover os imports nao utilizados (`PawPrint`)
- Manter os icones existentes redistribuidos entre as novas categorias

