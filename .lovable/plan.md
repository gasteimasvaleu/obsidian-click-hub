

# Remover Transicoes de Pagina Animadas

## Problema

As transicoes com `framer-motion` estao causando um efeito visual ruim, parecendo que a pagina esta "quebrando" durante a navegacao.

## Solucao

Remover o componente `AnimatedRoutes` e voltar a renderizar as rotas diretamente, sem animacao.

## Mudancas

| Arquivo | Acao |
|---------|------|
| `src/App.tsx` | Remover o `<AnimatedRoutes>` wrapper e renderizar `<Routes>` diretamente |
| `src/components/AnimatedRoutes.tsx` | Deletar o arquivo |

A navegacao voltara a ser instantanea, sem efeitos de fade/slide, que e o comportamento mais natural e performatico em dispositivos moveis.

