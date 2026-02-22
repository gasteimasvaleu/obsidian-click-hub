

# Reduzir espaco entre navbar e video na home

## Problema
No iPhone real, ha um espaco excessivo entre a navbar fixa e o video de animacao. Isso acontece porque o container do video usa `pt-16` (64px) de padding superior para compensar a navbar fixa, mas no iPhone com a barra de status nativa, esse valor fica grande demais.

## Solucao
Reduzir o padding-top do container do video de `pt-16` para `pt-14` (56px). Isso diminui o espaco em 8px, mantendo a compensacao necessaria para a navbar fixa mas eliminando o excesso visual.

## Detalhe tecnico

**Arquivo:** `src/pages/Index.tsx`, linha 42

Alterar:
```
pt-16
```
Para:
```
pt-14
```

Isso afeta apenas o espaco acima do video na pagina inicial, sem impactar nenhum outro componente.

