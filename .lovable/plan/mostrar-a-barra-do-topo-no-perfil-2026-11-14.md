# Mostrar a barra do topo no Perfil

O Perfil é a única página principal que não mostra a barra do topo com o logo. As outras (Bíblia, Jogos, Sobre etc.) mostram. Por isso parece que a barra some ao entrar no Perfil.

## O que muda
- O Perfil passa a mostrar a mesma barra do topo das outras páginas.
- O conteúdo começa logo abaixo da barra, com o mesmo espaço da Bíblia. O excesso que você apontou antes vinha justamente de reservar esse espaço sem a barra.
- O menu inferior continua como está.

## Detalhes técnicos
- `src/pages/Profile.tsx`: importar e renderizar `FuturisticNavbar` no topo, e voltar o container para `pt-20` (o padrão das páginas com barra), mantendo `px-4 max-w-[58rem]`. Conferir que o carregamento inicial (estado de loading) também mostra a barra.
