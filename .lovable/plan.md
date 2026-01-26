


## Importar 20 Orações Católicas Tradicionais do GitHub

### Fonte dos Dados

**Repositório:** Augusto240/catholic_prayers_api  
**Licença:** MIT (livre para uso)

---

### Orações a Serem Importadas

| # | Título | Categoria Original | Categoria Mapeada |
|---|--------|-------------------|-------------------|
| 1 | Ave Maria | mariana | mariana |
| 2 | Pai Nosso | essencial | essencial |
| 3 | Credo | essencial | essencial |
| 4 | Glória | essencial | essencial |
| 5 | Salve Rainha | mariana | mariana |
| 6 | Santo Anjo | proteção | protecao |
| 7 | Ato de Contrição | penitência | penitencia |
| 8 | Magnificat | mariana | mariana |
| 9 | Memorare (Lembrai-vos) | mariana | mariana |
| 10 | Angelus | mariana | mariana |
| 11 | Regina Coeli | mariana | mariana |
| 12 | Oração a São Miguel Arcanjo | proteção | protecao |
| 13 | Confiteor (Confesso) | penitência | penitencia |
| 14 | Oração Antes da Refeição | cotidiano | refeicao |
| 15 | Oração Depois da Refeição | cotidiano | refeicao |
| 16 | Sub Tuum Praesidium | mariana | mariana |
| 17 | Veni Sancte Spiritus | espírito_santo | espirito_santo |
| 18 | Oração de Fátima | mariana | mariana |
| 19 | Adoro Te Devote | eucarística | eucaristica |
| 20 | Terço da Divina Misericórdia | divina_misericórdia | misericordia |

---

### Novas Categorias

| Categoria | Nome Exibido | Ícone | Qtd Orações |
|-----------|--------------|-------|-------------|
| essencial | Essencial | BookOpen | 3 |
| mariana | Maria | Star | 9 |
| protecao | Proteção | Shield | 2 |
| penitencia | Penitência | Heart | 2 |
| refeicao | Refeição | UtensilsCrossed | 2 |
| espirito_santo | Espírito Santo | Sparkles | 1 |
| eucaristica | Eucarística | Church | 1 |
| misericordia | Misericórdia | HeartHandshake | 1 |

---

### Alterações a Serem Feitas

**1. Migration SQL (inserir orações)**

Vou usar a ferramenta de insert para adicionar as 20 orações ao banco:
- Remover orações de exemplo anteriores (opcionalmente mantê-las)
- Inserir as 20 orações tradicionais com categorias mapeadas

**2. Atualizar CategoryGrid.tsx**

Substituir as categorias atuais (familia, saude, escola, etc.) pelas novas:

```typescript
const categories: Category[] = [
  { id: "essencial", name: "Essencial", icon: "book-open" },
  { id: "mariana", name: "Maria", icon: "star" },
  { id: "protecao", name: "Proteção", icon: "shield" },
  { id: "penitencia", name: "Penitência", icon: "heart" },
  { id: "refeicao", name: "Refeição", icon: "utensils-crossed" },
  { id: "espirito_santo", name: "Espírito Santo", icon: "sparkles" },
  { id: "eucaristica", name: "Eucarística", icon: "church" },
  { id: "misericordia", name: "Misericórdia", icon: "heart-handshake" },
];

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "star": Star,
  "shield": Shield,
  "heart": Heart,
  "sparkles": Sparkles,
  "heart-handshake": HeartHandshake,
  "utensils-crossed": UtensilsCrossed,
  "church": Church,
};
```

**3. Atualizar PrayersManager.tsx (Admin)**

Atualizar o dropdown de categorias com as mesmas 8 categorias novas.

---

### Resumo das Alterações

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| Banco de dados | INSERT | 20 orações tradicionais católicas |
| `src/components/oracoes/CategoryGrid.tsx` | Editar | Novas 8 categorias com ícones |
| `src/pages/admin/PrayersManager.tsx` | Editar | Atualizar dropdown de categorias |

---

### Resultado Final

Após a implementação, a página de Orações terá:
- 8 categorias organizadas (Essencial, Maria, Proteção, Penitência, Refeição, Espírito Santo, Eucarística, Misericórdia)
- 20 orações tradicionais católicas importadas do repositório
- Botão de favoritos funcionando
- Admin consegue gerenciar todas as orações

