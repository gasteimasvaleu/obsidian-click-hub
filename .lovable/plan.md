

# Correcao do gradiente do titulo "Baixe o App"

## Problema
O titulo na linha 32 de `src/pages/Download.tsx` usa o gradiente errado:
`from-primary via-primary-foreground to-primary`

## Correcao
Substituir pelo gradiente padrao do projeto:
`from-primary via-primary to-primary/60`

## Arquivo afetado
- `src/pages/Download.tsx` - Linha 32: alterar as classes do gradiente do h1

