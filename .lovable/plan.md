

# Corrigir categorias do Novo Testamento na Biblia

## Problema
Os livros de Timoteo (e todas as cartas paulinas + Atos) nao aparecem na interface porque os nomes das categorias no banco de dados nao correspondem aos filtros usados no codigo.

**Categorias no banco vs filtros no codigo:**

| Filtro no codigo | Categoria no banco | Resultado |
|---|---|---|
| `cartas_paulinas` | `cartas_paulo` | Nao aparece |
| `historicos` | `historico` | Nao aparece |
| `cartas_gerais` | `cartas_gerais` | OK |
| `evangelhos` | `evangelhos` | OK |
| `profetico` | `profetico` | OK |

Isso afeta **15 livros**: Romanos, 1/2 Corintios, Galatas, Efesios, Filipenses, Colossenses, 1/2 Tessalonicenses, **1/2 Timoteo**, Tito, Filemom e Atos.

## Solucao
Atualizar os filtros no arquivo `src/pages/biblia/BibliaPage.tsx` para corresponder aos valores reais do banco de dados.

## Detalhe tecnico

**Arquivo:** `src/pages/biblia/BibliaPage.tsx`

Alterar o objeto `categories.novo` (aprox. linha 49-55):

De:
```js
novo: [
  { name: 'Evangelhos', filter: 'evangelhos' },
  { name: 'Historicos', filter: 'historicos' },
  { name: 'Cartas Paulinas', filter: 'cartas_paulinas' },
  { name: 'Cartas Gerais', filter: 'cartas_gerais' },
  { name: 'Profetico', filter: 'profetico' }
]
```

Para:
```js
novo: [
  { name: 'Evangelhos', filter: 'evangelhos' },
  { name: 'Historicos', filter: 'historico' },
  { name: 'Cartas Paulinas', filter: 'cartas_paulo' },
  { name: 'Cartas Gerais', filter: 'cartas_gerais' },
  { name: 'Profetico', filter: 'profetico' }
]
```

Apenas duas mudancas de string: `historicos` -> `historico` e `cartas_paulinas` -> `cartas_paulo`.

Com isso, todos os 27 livros do Novo Testamento passam a aparecer corretamente, incluindo 1 Timoteo e 2 Timoteo.

