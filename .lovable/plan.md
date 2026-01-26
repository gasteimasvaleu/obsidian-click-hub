

## Importar Orações do GitHub para o Banco de Dados

### Fonte de Dados

Repositório: **Augusto240/catholic_prayers_api**
URL: `https://raw.githubusercontent.com/Augusto240/catholic_prayers_api/main/prayers.json`
Licença: MIT (livre para uso)

O arquivo contém **20 orações católicas tradicionais** em português com a seguinte estrutura:
```json
{
  "id": "ave_maria",
  "title": "Ave Maria",
  "category": "mariana",
  "text": "Ave Maria, cheia de graça..."
}
```

---

### Mapeamento de Categorias

As categorias do repositório precisam ser mapeadas para as nossas categorias existentes ou podemos adicionar novas:

| Categoria Original | Mapeamento Sugerido | Ícone |
|-------------------|--------------------|----|
| essencial | essencial (nova) | BookOpen |
| mariana | mariana (nova) | Star |
| proteção | protecao (existente) | Shield |
| penitência | penitencia (nova) | Heart |
| cotidiano | refeicao (existente) | UtensilsCrossed |
| espírito_santo | espirito_santo (nova) | Sparkles |
| eucarística | eucaristica (nova) | Church |
| divina_misericórdia | misericordia (nova) | HeartHandshake |

**Opção A**: Manter as categorias originais do repositório (mais completo)
**Opção B**: Adaptar para as categorias existentes (menos categorias)

---

### Abordagem de Implementação

**Opção 1: Migration SQL Direta** (Recomendado)
- Inserir as 20 orações diretamente via SQL na migration
- Simples e imediato
- Não precisa de Edge Function

**Opção 2: Edge Function para Importação**
- Criar função que busca o JSON do GitHub
- Útil se quiser atualizar futuramente
- Mais complexo

---

### Alterações Propostas

**1. Atualizar CategoryGrid com novas categorias**

Adicionar as novas categorias que vieram do repositório:
- Essencial (orações básicas)
- Mariana (orações à Virgem Maria)
- Penitência (arrependimento)
- Espírito Santo
- Eucarística (adoração eucarística)
- Divina Misericórdia

| Arquivo | Alteração |
|---------|-----------|
| `src/components/oracoes/CategoryGrid.tsx` | Adicionar novas categorias com ícones |

**2. Atualizar lista de categorias no Admin**

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/admin/PrayersManager.tsx` | Adicionar novas categorias no dropdown |

**3. Criar Migration SQL**

Inserir as 20 orações do repositório no banco:

```sql
-- Limpar orações exemplo anteriores (opcional)
DELETE FROM prayers WHERE title IN ('Oração pela Família', 'Oração pelos Pais', ...);

-- Inserir orações do repositório GitHub
INSERT INTO prayers (title, content, category, icon_name, display_order, available)
VALUES 
  ('Ave Maria', 'Ave Maria, cheia de graça...', 'mariana', 'star', 1, true),
  ('Pai Nosso', 'Pai Nosso que estais nos Céus...', 'essencial', 'book-open', 2, true),
  ...
```

---

### Orações a Serem Importadas

1. **Ave Maria** - Categoria: mariana
2. **Pai Nosso** - Categoria: essencial  
3. **Credo** - Categoria: essencial
4. **Glória** - Categoria: essencial
5. **Salve Rainha** - Categoria: mariana
6. **Santo Anjo** - Categoria: proteção
7. **Ato de Contrição** - Categoria: penitência
8. **Magnificat** - Categoria: mariana
9. **Memorare (Lembrai-vos)** - Categoria: mariana
10. **Angelus** - Categoria: mariana
11. **Regina Coeli** - Categoria: mariana
12. **Oração a São Miguel Arcanjo** - Categoria: proteção
13. **Confiteor (Confesso)** - Categoria: penitência
14. **Oração Antes da Refeição** - Categoria: cotidiano/refeicao
15. **Oração Depois da Refeição** - Categoria: cotidiano/refeicao
16. **Sub Tuum Praesidium** - Categoria: mariana
17. **Veni Sancte Spiritus** - Categoria: espírito_santo
18. **Oração de Fátima** - Categoria: mariana
19. **Adoro Te Devote** - Categoria: eucarística
20. **Terço da Divina Misericórdia** - Categoria: misericordia

---

### Resumo das Alterações

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| Migration SQL | Criar | Inserir 20 orações do repositório GitHub |
| `src/components/oracoes/CategoryGrid.tsx` | Editar | Adicionar 6 novas categorias |
| `src/pages/admin/PrayersManager.tsx` | Editar | Atualizar dropdown de categorias |

---

### Categorias Finais (após importação)

| ID | Nome | Ícone | Qtd |
|----|------|-------|-----|
| essencial | Essencial | BookOpen | 3 |
| mariana | Maria | Star | 9 |
| protecao | Proteção | Shield | 2 |
| penitencia | Penitência | Heart | 2 |
| refeicao | Refeição | UtensilsCrossed | 2 |
| espirito_santo | Espírito Santo | Sparkles | 1 |
| eucaristica | Eucarística | Church | 1 |
| misericordia | Misericórdia | HeartHandshake | 1 |

Orações existentes das categorias anteriores (família, escola, etc.) podem ser mantidas ou substituídas.

