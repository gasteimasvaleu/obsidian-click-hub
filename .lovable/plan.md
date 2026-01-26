

## Expansão Robusta do Livrinho de Orações

### Diagnóstico Atual

| Categoria | Qtd Atual | Tamanho Médio |
|-----------|-----------|---------------|
| Essencial | 3 | 327 chars |
| Mariana | 8 | 402 chars |
| Eucarística | 1 | 1077 chars |
| Espírito Santo | 1 | 401 chars |
| Misericórdia | 1 | 599 chars |
| Proteção | 5 | 150 chars |
| Penitência | 2 | 280 chars |
| Refeição | 5 | 99 chars |
| Família | 4 | 102 chars |
| Amigos | 3 | 82 chars |
| Escola | 4 | 91 chars |
| Gratidão | 3 | 96 chars |
| Manhã | 3 | 87 chars |
| Noite | 3 | 86 chars |
| Saúde | 3 | 87 chars |

**Total atual: 49 orações**

---

### Plano de Expansão

#### 1. Novas Orações Tradicionais Completas

**Categoria Essencial (adicionar 5):**
- Sinal da Cruz
- Ato de Fé
- Ato de Esperança
- Ato de Caridade
- Oração a São José

**Categoria Mariana (adicionar 4):**
- Consagração a Nossa Senhora
- Oração a Nossa Senhora Aparecida
- Oração a Nossa Senhora de Fátima
- Terço (instruções completas)

**Categoria Espírito Santo (adicionar 4):**
- Sequência do Espírito Santo (Veni Sancte Spiritus)
- Oração ao Espírito Santo de Santo Agostinho
- Oração dos Sete Dons
- Veni Creator Spiritus

**Categoria Eucarística (adicionar 3):**
- Oração de Santo Tomás antes da Comunhão
- Oração após a Comunhão
- Anima Christi

**Categoria Misericórdia (adicionar 2):**
- Oração a Jesus Misericordioso
- Ladainha da Divina Misericórdia

**Categoria Penitência (adicionar 2):**
- Miserere (Salmo 50)
- Confissão Geral

---

#### 2. Expandir Orações Infantis (tornar mais completas)

**Família (adicionar 4):**
- Oração pela Unidade Familiar (completa)
- Oração pelos Padrinhos
- Oração para Resolver Conflitos
- Bênção da Família

**Amigos (adicionar 4):**
- Oração pela Amizade Verdadeira
- Oração por Amigos Distantes
- Oração para Perdoar um Amigo
- Oração de Gratidão pelos Amigos

**Escola (adicionar 4):**
- Oração pelo Ano Letivo
- Oração nas Dificuldades de Aprendizado
- Oração de Formatura/Encerramento
- Oração pela Escola

**Gratidão (adicionar 4):**
- Oração de Ação de Graças Solene
- Te Deum (versão simplificada)
- Oração de Gratidão pela Vida
- Oração pelos Dons Recebidos

**Manhã (adicionar 3):**
- Oferecimento do Dia Completo
- Oração das Laudes (simplificada)
- Consagração da Manhã

**Noite (adicionar 3):**
- Oração de Completas (simplificada)
- Exame de Consciência Noturno
- Oração de Entrega do Dia

**Saúde (adicionar 4):**
- Oração pelos Doentes
- Oração a São Pio de Pietrelcina
- Oração por Cura Interior
- Oração pelos Médicos e Enfermeiros

---

#### 3. Novas Categorias Sugeridas

**Santos (nova categoria - 8 orações):**
- Oração de São Francisco de Assis
- Oração de Santo Inácio de Loyola
- Oração de Santa Teresa de Ávila
- Oração de São João Paulo II
- Oração de Madre Teresa de Calcutá
- Oração a São Miguel Arcanjo
- Oração ao Anjo da Guarda (expandida)
- Oração a São Judas Tadeu

**Sacramentos (nova categoria - 5 orações):**
- Preparação para Batismo
- Preparação para Primeira Comunhão
- Preparação para Crisma
- Oração pelo Matrimônio
- Oração pelos Sacerdotes

**Vocação (nova categoria - 4 orações):**
- Oração pela Minha Vocação
- Oração pelas Vocações Sacerdotais
- Oração pelas Vocações Religiosas
- Oração pela Vocação Matrimonial

---

### Resumo da Expansão

| Tipo | Quantidade |
|------|------------|
| Orações atuais | 49 |
| Novas orações tradicionais | +20 |
| Orações infantis expandidas | +26 |
| Novas categorias | +17 |
| **Total Final** | **~112 orações** |

---

### Implementação Técnica

1. **Banco de Dados**
   - Inserir novas orações na tabela `prayers` via SQL
   - Adicionar novas categorias no array `categories` em `CategoryGrid.tsx`
   - Adicionar novos ícones no `iconMap` para novas categorias

2. **Novos Ícones para Categorias**
   - Santos: `Crown` ou `Users`
   - Sacramentos: `Droplets` ou `Cross`
   - Vocação: `Compass` ou `Map`

3. **Admin Manager**
   - Atualizar lista de categorias em `PrayersManager.tsx`

---

### Detalhes Técnicos

**Arquivos a modificar:**
- `src/components/oracoes/CategoryGrid.tsx` - adicionar novas categorias
- `src/pages/admin/PrayersManager.tsx` - adicionar novas categorias no select
- Banco de dados - inserir ~63 novas orações via SQL

**Estrutura de cada oração:**
```sql
INSERT INTO prayers (title, content, category, icon_name, display_order, available)
VALUES (
  'Título da Oração',
  'Texto completo da oração com formatação...',
  'categoria',
  'nome-do-icone',
  ordem,
  true
);
```

