# Reduzir o espaço no topo do Perfil

O espaço em cima aumentou na padronização: o Perfil passou a usar o recuo das páginas que têm barra no topo, mas ele não tem essa barra.

## O que muda
- Voltar o espaço do topo ao que era antes: pequeno no celular e um pouco maior no desktop.
- A largura lateral continua igual à da Bíblia.

## Detalhes técnicos
- `src/pages/Profile.tsx`: no container, trocar `pt-20` por `pt-4 md:pt-8` (valor anterior), mantendo `px-4 max-w-[58rem]`.
