
## Alterar "Ebooks & Áudio" para "Audiofy" com Ícone de Música

### Resumo

Atualizar o item "Ebooks & Áudio" no array `navigationActions` para "Audiofy", alterar o ícone de `BookOpen` para `Music`, e atualizar a rota para `/audiofy`.

---

### Alterações Necessárias

| Arquivo | Linha | Alteração |
|---------|-------|-----------|
| `src/pages/Index.tsx` | 4 | Substituir `BookOpen` por `Music` no import |
| `src/pages/Index.tsx` | 75 | Atualizar item para "Audiofy" com ícone `Music` e rota `/audiofy` |

---

### Detalhes da Alteração

**Linha 4 - Imports:**
```typescript
// Antes
import { Users, BookOpen, MessageCircle, Gamepad2, UserCircle, Package, Book, Heart, HandHeart } from "lucide-react";

// Depois
import { Users, Music, MessageCircle, Gamepad2, UserCircle, Package, Book, Heart, HandHeart } from "lucide-react";
```

**Linha 75 - Item do array:**
```typescript
// Antes
{ title: "Ebooks & Áudio", icon: BookOpen, action: () => navigate('/ebooks'), gradient: "from-green-500 to-emerald-500" },

// Depois
{ title: "Audiofy", icon: Music, action: () => navigate('/audiofy'), gradient: "from-green-500 to-emerald-500" },
```

---

### Resultado Esperado

1. O card "Ebooks & Áudio" será substituído por "Audiofy"
2. O ícone de livro aberto será substituído pelo ícone `Music` (nota musical)
3. O clique direcionará para a página `/audiofy`
4. O gradiente verde será mantido
