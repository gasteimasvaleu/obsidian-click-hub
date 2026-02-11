
# Adicionar mais orações robustas ao Livrinho de Orações

## Situacao atual (112 orações)

As categorias com menos orações e que mais precisam de reforço:

| Categoria | Qtd atual | Orações a adicionar |
|-----------|-----------|-------------------|
| Misericórdia | 3 | +4 |
| Eucarística | 4 | +4 |
| Penitência | 4 | +3 |
| Vocação | 4 | +3 |
| Espírito Santo | 5 | +3 |
| Proteção | 5 | +3 |
| Refeição | 5 | +2 |
| Sacramentos | 5 | +3 |
| Manhã | 6 | +2 |
| Noite | 6 | +2 |
| Gratidão | 7 | +2 |
| Amigos | 7 | +1 |
| Família | 8 | +2 |
| Santos | 8 | +3 |
| Escola | 8 | +1 |
| Essencial | 8 | +2 |
| Saúde | 7 | +2 |
| Mariana | 12 | +2 |

**Total: ~42 novas orações**, levando o livrinho de 112 para ~154 orações.

## Orações planejadas por categoria

### Misericórdia (+4)
- Oração das Chagas de Jesus
- Novena da Misericórdia (Resumo)
- Oração de Abandono à Misericórdia
- Oração pelo Perdão dos Pecados do Mundo

### Eucarística (+4)
- Tantum Ergo
- O Salutaris Hostia
- Visita ao Santíssimo Sacramento
- Oração de Reparação Eucarística

### Penitência (+3)
- Salmo 130 (De Profundis)
- Oração de Arrependimento
- Oração antes da Confissão

### Vocação (+3)
- Oração pelas Vocações Sacerdotais
- Oração pela Vocação Religiosa
- Oração pelo Discernimento Vocacional

### Espírito Santo (+3)
- Oração pelos Frutos do Espírito Santo
- Novena ao Espírito Santo (Oração)
- Oração de Pentecostes

### Proteção (+3)
- Oração a São Rafael Arcanjo
- Oração a São Gabriel Arcanjo
- Oração de Proteção da Família

### Refeição (+2)
- Bênção da Mesa em Família
- Oração de Gratidão pelo Pão de Cada Dia

### Sacramentos (+3)
- Oração de Preparação para a Confissão
- Oração pelo Sacramento do Matrimônio
- Oração pela Unção dos Enfermos

### Manhã (+2)
- Oração de Entrega do Dia a Deus
- Preces Matinais de São Francisco

### Noite (+2)
- Oração de São João Bosco para a Noite
- Oração de Proteção Noturna

### Gratidão (+2)
- Oração de Gratidão pelo Perdão
- Oração de Gratidão pela Eucaristia

### Amigos (+1)
- Oração para Ser um Bom Amigo

### Família (+2)
- Oração pela Proteção do Lar
- Oração pelos Filhos

### Santos (+3)
- Oração a Santo Antônio
- Oração a Santa Teresinha
- Oração a São Padre Pio

### Escola (+1)
- Oração pela Formatura

### Essencial (+2)
- Oração do Senhor (versão completa com reflexão)
- Ladainha de Todos os Santos (resumida)

### Saúde (+2)
- Oração a São Camilo de Léllis
- Oração pela Cura Interior

### Mariana (+2)
- Ladainha de Nossa Senhora
- Oração da Medalha Milagrosa

## Implementacao

### Passo unico

Executar um INSERT em massa na tabela `prayers` com as ~42 novas orações, cada uma contendo:
- `title`: nome da oração
- `content`: texto completo e robusto da oração (orações tradicionais com texto fiel; orações infantis com linguagem acessível)
- `category`: categoria existente correspondente
- `icon_name`: ícone da categoria (seguindo o padrão já usado)
- `display_order`: sequencial após as orações existentes na categoria
- `available`: true

### Nenhum arquivo de codigo sera alterado

Todas as categorias e componentes já existem. As novas orações aparecerão automaticamente no app após a inserção no banco.

### Qualidade do conteudo

- Orações tradicionais (Tantum Ergo, De Profundis, etc.) terão o texto original em português
- Orações infantis/cotidianas terão linguagem simples e acolhedora
- Todas respeitarão a doutrina católica
