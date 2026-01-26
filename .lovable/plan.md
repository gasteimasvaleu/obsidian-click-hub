

## Alterar "Colorir" para "Orações" com Ícone Correto

### Resumo

Alterar o primeiro item do array `navigationActions` de "Colorir" para "Orações", atualizando o ícone de `Palette` para um ícone mais adequado para orações e a rota de navegação.

---

### Alteração Necessária

| Arquivo | Linha | Alteração |
|---------|-------|-----------|
| `src/pages/Index.tsx` | 4 | Adicionar import do ícone `HandHeart` |
| `src/pages/Index.tsx` | 74 | Atualizar item "Colorir" para "Orações" |

---

### Detalhes da Alteração

**Linha 4 - Imports:**
```typescript
// Antes
import { Users, Palette, BookOpen, MessageCircle, Gamepad2, UserCircle, Package, Book, Heart } from "lucide-react";

// Depois
import { Users, BookOpen, MessageCircle, Gamepad2, UserCircle, Package, Book, Heart, HandHeart } from "lucide-react";
```

**Linha 74 - Item do array:**
```typescript
// Antes
{ title: "Colorir", icon: Palette, action: () => navigate('/boobiegoods'), gradient: "from-blue-500 to-cyan-500" },

// Depois
{ title: "Orações", icon: HandHeart, action: () => navigate('/oracoes'), gradient: "from-blue-500 to-cyan-500" },
```

---

### Resultado Esperado

1. O card "Colorir" será substituído por "Orações"
2. O ícone de paleta será substituído pelo ícone `HandHeart` (mãos em oração)
3. O clique direcionará para a página `/oracoes`
4. O gradiente azul será mantido

