
Use JSON.

O que selecionar agora:
- Tipo de chave: JSON
- Não escolha P12

Por quê:
- RevenueCat usa a credencial da service account em arquivo JSON
- P12 é formato antigo e não é o que você precisa para esse fluxo

Então faça assim:
1. Adicionar chave
2. Criar nova chave
3. Selecionar JSON
4. Criar
5. Baixar o arquivo

Se aparecer bloqueio para criar JSON, o problema não é o formato: é política do projeto Google Cloud.

Resumo:
```text
Correto: JSON
Errado para esse caso: P12
```
