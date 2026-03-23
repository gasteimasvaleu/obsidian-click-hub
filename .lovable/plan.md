

## Substituir Biblia ACF pela Ave Maria (Católica completa - 73 livros)

### Contexto

O JSON da Ave Maria (`fidalgobr/bibliaAveMariaJSON`) tem estrutura diferente da ACF:
- Organizado em `antigoTestamento` (46 livros) e `novoTestamento` (27 livros)
- Cada livro: `{ nome, capitulos: [{ capitulo, versiculos: [{ versiculo, texto }] }] }`
- Não possui campo `group`/`category` -- precisaremos mapear manualmente

### Plano

**1. Atualizar a edge function `import-bible-data`**

- Trocar a URL de origem para `https://raw.githubusercontent.com/fidalgobr/bibliaAveMariaJSON/main/bibliaAveMaria.json`
- Adaptar o parser para a nova estrutura (`nome`, `capitulos`, `versiculos` em vez de `name`, `chapters`, objetos)
- Incluir um mapeamento manual de cada livro para sua categoria (`pentateuco`, `historicos`, `poeticos`, `profetas_maiores`, `profetas_menores`, `deuterocanonicos` para AT; `evangelhos`, `historico`, `cartas_paulo`, `cartas_gerais`, `profetico` para NT)
- Antes de importar, deletar todos os dados existentes nas tabelas `bible_verses`, `bible_chapters`, `bible_books` (nessa ordem, por causa das foreign keys)
- Também limpar `user_favorite_verses`, `user_verse_notes`, `user_reading_history` e `theological_comment` cacheados, já que os IDs mudarão

**2. Adicionar categoria "Deuterocanônicos" no frontend**

- Em `BibliaPage.tsx`, adicionar `{ name: 'Deuterocanônicos', filter: 'deuterocanonicos' }` na lista de categorias do Antigo Testamento
- Os 7 livros deuterocanônicos (Tobias, Judite, Sabedoria, Eclesiástico/Sirácida, Baruc, 1 Macabeus, 2 Macabeus) serão categorizados como `deuterocanonicos`

**3. Executar a importação**

- Deploy da edge function atualizada
- Invocar a função para realizar a importação completa

### Detalhes Técnicos

Mapeamento de categorias por livro (AT):
```text
pentateuco:        Gênesis, Êxodo, Levítico, Números, Deuteronômio
historicos:        Josué, Juízes, Rute, 1 Samuel, 2 Samuel, 1 Reis, 2 Reis, 1 Crônicas, 2 Crônicas, Esdras, Neemias, Ester
poeticos:          Jó, Salmos, Provérbios, Eclesiastes, Cântico dos Cânticos
profetas_maiores:  Isaías, Jeremias, Lamentações, Ezequiel, Daniel
profetas_menores:  Oséias, Joel, Amós, Abdias, Jonas, Miquéias, Naum, Habacuc, Sofonias, Ageu, Zacarias, Malaquias
deuterocanonicos:  Tobias, Judite, Sabedoria, Eclesiástico, Baruc, 1 Macabeus, 2 Macabeus
```

NT:
```text
evangelhos:    Mateus, Marcos, Lucas, João
historico:     Atos dos Apóstolos
cartas_paulo:  Romanos, 1 Coríntios, 2 Coríntios, Gálatas, Efésios, Filipenses, Colossenses, 1 Tessalonicenses, 2 Tessalonicenses, 1 Timóteo, 2 Timóteo, Tito, Filêmon, Hebreus
cartas_gerais: Tiago, 1 Pedro, 2 Pedro, 1 João, 2 João, 3 João, Judas
profetico:     Apocalipse
```

**Impacto**: Dados de favoritos, notas e histórico de leitura dos usuários serão perdidos pois os IDs dos versículos mudarão. Isso é inevitável ao trocar a versão bíblica.

