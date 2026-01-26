
## Transformar Ebooks em Audiofy (Página de Músicas)

### Resumo

Renomear a página `/ebooks` para `/audiofy`, focando exclusivamente em músicas. Alterar todas as referências de "ebook lido" para "música ouvida" na gamificação, perfil e dashboard.

---

### Arquivos que Serão Alterados

| Arquivo | Tipo de Alteração |
|---------|------------------|
| `src/pages/Ebooks.tsx` | Renomear para `Audiofy.tsx`, atualizar conteúdo |
| `src/App.tsx` | Atualizar rotas e imports |
| `src/components/admin/AdminSidebar.tsx` | Alterar label "Ebooks" para "Audiofy" |
| `src/pages/Profile.tsx` | Alterar labels de gamificação |
| `src/hooks/useUserProgress.tsx` | Alterar tipos de atividade e badges |

---

### Alterações por Arquivo

#### 1. Renomear `src/pages/Ebooks.tsx` para `src/pages/Audiofy.tsx`

**Alterações visuais:**
- Título: "Biblioteca Digital" → "Audiofy"
- Subtítulo: "Ebooks, audiobooks e vídeos exclusivos" → "Músicas cristãs para crianças"
- EmptyState: "Biblioteca em construção" → "Músicas em construção"
- Descrição: "ebooks, audiobooks e vídeos" → "músicas cristãs"
- Manter o vídeo atual (`ebooksnovo.mp4`) conforme solicitado

**Alterações funcionais:**
- Alterar `addActivity('ebook_read', ...)` para `addActivity('music_listened', ...)`

#### 2. Atualizar `src/App.tsx`

**Rotas:**
```
/ebooks → /audiofy
```

**Imports:**
```
import Ebooks → import Audiofy
```

**Navbar:**
```
{ name: 'Mídia', url: '/ebooks', icon: BookOpen }
→ { name: 'Audiofy', url: '/audiofy', icon: Music }
```

#### 3. Atualizar `src/components/admin/AdminSidebar.tsx`

```
{ name: 'Ebooks', url: '/admin/ebooks', icon: BookOpen }
→ { name: 'Audiofy', url: '/admin/ebooks', icon: Music }
```

#### 4. Atualizar `src/pages/Profile.tsx`

**Card de estatísticas (linha ~153-163):**
```
Título: "E-books" → "Músicas"
Valor: progress.ebooks_read → progress.ebooks_read (mesmo campo do banco)
Label: "e-books lidos" → "músicas ouvidas"
Ícone: Activity → Music
```

**Função getBadgeName (linha ~290-300):**
```
first_ebook: 'Primeiro E-book' → 'Primeira Música'
ebooks_5: '5 E-books' → '5 Músicas'
```

**Função getActivityTypeName (linha ~303-309):**
```
ebook_read: 'E-book lido' → 'Música ouvida'
```

#### 5. Atualizar `src/hooks/useUserProgress.tsx`

**Função updateProgress (linha ~129-135):**
```javascript
// Antes
} else if (activityType === 'ebook_read') {
  updates.ebooks_read = progress.ebooks_read + 1;
}

// Depois (adicionar suporte para ambos)
} else if (activityType === 'ebook_read' || activityType === 'music_listened') {
  updates.ebooks_read = progress.ebooks_read + 1;
}
```

**Função checkBadges (linha ~160-161):**
- Manter a lógica atual, apenas os nomes mudam no Profile.tsx

**Função getBadgeName (linha ~222-228):**
```
first_ebook: 'Primeiro E-book' → 'Primeira Música'
ebooks_5: '5 E-books Lidos' → '5 Músicas Ouvidas'
```

---

### Banco de Dados

Nenhuma alteração no banco de dados é necessária. O campo `ebooks_read` na tabela `user_progress` será reutilizado para contar músicas ouvidas, mantendo compatibilidade com dados existentes.

---

### Resultado Esperado

1. Nova rota `/audiofy` com página focada em músicas
2. Navbar principal com item "Audiofy" ao invés de "Mídia"
3. Toast de conquista: "Primeira Música!" ao invés de "Primeiro E-book!"
4. Perfil mostrando "músicas ouvidas" ao invés de "e-books lidos"
5. Dashboard admin com link "Audiofy" na sidebar
6. Vídeo atual mantido na página Audiofy
7. Música existente no banco continua funcionando
