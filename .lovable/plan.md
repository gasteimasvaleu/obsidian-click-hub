

## Corrigir Orações Antigas que "Sumiram"

### Diagnóstico

As orações antigas **NÃO foram deletadas** - ainda estão no banco de dados. O problema é que o `CategoryGrid.tsx` foi atualizado com **novas categorias** (`essencial`, `mariana`, `protecao`...), mas as orações antigas usam **categorias diferentes** (`familia`, `saude`, `escola`...).

### Estado Atual do Banco

| Tipo | Quantidade | Categorias | Data |
|------|------------|------------|------|
| Orações Infantis (antigas) | 29 | familia, saude, escola, gratidao, amigos, noite, manha, refeicao | 11:36:17 |
| Orações Tradicionais (novas) | 20 | essencial, mariana, protecao, penitencia, refeicao, espirito_santo, eucaristica, misericordia | 11:49:25 |

---

### Solução Proposta: Combinar Todas as Categorias

Vou atualizar o `CategoryGrid.tsx` para incluir **todas as categorias** (antigas + novas), permitindo que o usuário veja tanto as orações infantis quanto as tradicionais.

#### Categorias Combinadas (15 no total)

| ID | Nome | Ícone | Tipo |
|----|------|-------|------|
| essencial | Essencial | BookOpen | Nova |
| mariana | Maria | Star | Nova |
| protecao | Proteção | Shield | Ambas |
| penitencia | Penitência | Heart | Nova |
| refeicao | Refeição | UtensilsCrossed | Ambas |
| espirito_santo | Espírito Santo | Sparkles | Nova |
| eucaristica | Eucarística | Church | Nova |
| misericordia | Misericórdia | HeartHandshake | Nova |
| familia | Família | Users | Antiga |
| saude | Saúde | Heart | Antiga |
| escola | Escola | GraduationCap | Antiga |
| gratidao | Gratidão | Sparkles | Antiga |
| amigos | Amigos | Heart | Antiga |
| noite | Noite | Moon | Antiga |
| manha | Manhã | Sun | Antiga |

---

### Alterações Necessárias

**1. Atualizar CategoryGrid.tsx**

Adicionar as categorias antigas de volta ao array, mantendo também as novas categorias tradicionais.

**2. Atualizar PrayersManager.tsx**

Sincronizar o dropdown do admin para incluir todas as categorias.

---

### Resultado Esperado

- Todas as 49 orações visíveis (29 infantis + 20 tradicionais)
- 15 categorias para filtrar
- Botão favoritos funcionando para todas

