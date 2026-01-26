

## Transformar Página /boobiegoods em Livrinho de Orações

### Visão Geral

Substituir a ferramenta de "Foto para Colorir" por um **Livrinho de Orações Digital** organizado por categorias, onde as crianças podem:
- Navegar por categorias de orações (Família, Saúde, Proteção, Escola, etc.)
- Ler orações pré-cadastradas
- Favoritar orações para acesso rápido

---

### Estrutura Visual

```text
┌─────────────────────────────────────────┐
│  🙏 Livrinho de Orações                 │
│  "Encontre a oração perfeita para       │
│   cada momento"                         │
├─────────────────────────────────────────┤
│  [Categorias em Grid]                   │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │ 👨‍👩‍👧‍👦  │ │ ❤️   │ │ 🛡️   │            │
│  │Família│ │Saúde │ │Proteção           │
│  └──────┘ └──────┘ └──────┘            │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │ 📚   │ │ 🙏   │ │ ⭐   │            │
│  │Escola│ │Gratid.│ │Favorit│            │
│  └──────┘ └──────┘ └──────┘            │
├─────────────────────────────────────────┤
│  [Lista de Orações da Categoria]        │
│  ┌─────────────────────────────────┐    │
│  │ Oração pela Família             │    │
│  │ "Querido Deus, abençoe minha..."│    │
│  │ ⭐ Favoritar                    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

### Banco de Dados

**Tabela `prayers`** (Orações)

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único |
| title | text | Título da oração |
| content | text | Texto completo da oração |
| category | text | Categoria (familia, saude, protecao, escola, gratidao, amigos, noite, manha, refeicao) |
| icon_name | text | Nome do ícone Lucide |
| display_order | integer | Ordem de exibição |
| available | boolean | Se está disponível |
| created_at | timestamp | Data de criação |

**Tabela `user_favorite_prayers`** (Favoritos)

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único |
| user_id | uuid | ID do usuário |
| prayer_id | uuid | ID da oração |
| created_at | timestamp | Data de quando favoritou |

**RLS Policies:**
- `prayers`: Qualquer um pode ler orações disponíveis, admins podem gerenciar
- `user_favorite_prayers`: Usuários podem gerenciar apenas seus próprios favoritos

---

### Alterações no Frontend

**1. Renomear e atualizar a rota**

| Arquivo | Alteração |
|---------|-----------|
| `src/App.tsx` | Alterar import de `BoobieGoods` para `Oracoes`, atualizar navItems de "Colorir" para "Orações" com ícone `Heart` ou `BookHeart` |

**2. Nova página de Orações**

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/Oracoes.tsx` | Página principal com grid de categorias e lista de orações |

**Componentes da página:**
- Header com vídeo animado (podemos manter ou trocar)
- Grid de categorias (cards clicáveis com ícone e nome)
- Tab/seção de "Favoritos" com estrela
- Lista de orações da categoria selecionada
- Cada oração em um GlassCard com:
  - Título
  - Texto da oração
  - Botão de favoritar (estrela preenchida/vazia)
  - Botão de compartilhar

**3. Componentes auxiliares**

| Arquivo | Descrição |
|---------|-----------|
| `src/components/oracoes/CategoryGrid.tsx` | Grid de categorias com ícones |
| `src/components/oracoes/PrayerCard.tsx` | Card individual de uma oração |

---

### Categorias Sugeridas

| Categoria | Ícone | Descrição |
|-----------|-------|-----------|
| familia | Users | Orações pela família |
| saude | Heart | Orações por saúde e cura |
| protecao | Shield | Orações de proteção |
| escola | GraduationCap | Orações para escola/estudos |
| gratidao | Sparkles | Orações de agradecimento |
| amigos | Users | Orações pelos amigos |
| noite | Moon | Orações antes de dormir |
| manha | Sun | Orações ao acordar |
| refeicao | UtensilsCrossed | Orações antes das refeições |

---

### Admin: Gerenciador de Orações

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/admin/PrayersManager.tsx` | CRUD de orações para administradores |

Funcionalidades:
- Listar todas as orações
- Criar nova oração (título, conteúdo, categoria, ícone)
- Editar oração existente
- Ativar/desativar oração
- Reordenar orações

---

### Fluxo de Uso

1. Usuário acessa `/oracoes` (ou `/boobiegoods` que será redirecionado)
2. Vê grid de categorias
3. Clica em uma categoria (ex: "Família")
4. Vê lista de orações dessa categoria
5. Pode ler a oração completa
6. Pode favoritar clicando na estrela
7. Pode acessar "Favoritos" para ver suas orações salvas
8. Pode compartilhar via WhatsApp/copiar texto

---

### Dados Iniciais

Vou incluir algumas orações pré-cadastradas para cada categoria como seed inicial, por exemplo:

**Família:**
- "Oração pela Família" - "Querido Deus, abençoe minha família hoje..."
- "Oração pelos Pais" - "Senhor, obrigado pelos meus pais..."

**Saúde:**
- "Oração de Cura" - "Pai Celestial, te peço saúde..."

**Proteção:**
- "Oração de Proteção Diária" - "Deus, me proteja neste dia..."

*(~30-40 orações distribuídas nas categorias)*

---

### Resumo das Alterações

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| Migration SQL | Criar | Tabelas `prayers` e `user_favorite_prayers` com RLS |
| `src/pages/Oracoes.tsx` | Criar | Nova página de orações |
| `src/components/oracoes/CategoryGrid.tsx` | Criar | Grid de categorias |
| `src/components/oracoes/PrayerCard.tsx` | Criar | Card de oração |
| `src/pages/admin/PrayersManager.tsx` | Criar | CRUD admin |
| `src/App.tsx` | Editar | Atualizar rotas e navbar |
| `src/pages/BoobieGoods.tsx` | Remover | Não será mais necessário |

---

### Observação

A Edge Function `photo-transform` que era usada pela página de colorir pode ser mantida ou removida conforme preferir - ela não será mais necessária após essa mudança.

