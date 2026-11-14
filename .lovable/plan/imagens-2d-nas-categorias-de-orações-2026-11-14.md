# Imagens 2D nas categorias de Orações

Trocar os ícones dos 20 cards de categoria (Favoritos + 19 categorias) por desenhos 2D no mesmo estilo dos desenhos do Guia dos Pais: cartoon infantil católico, fundo transparente, detalhes em violeta.

## Desenhos (um por card)
Favoritos (estrela sorridente), Essencial (livrinho de orações aberto), Maria (Nossa Senhora com manto azul), Espírito Santo (pomba branca com raios), Eucarística (cálice e hóstia), Misericórdia (coração com raios de Jesus Misericordioso), Penitência (criança ajoelhada rezando), Santos (auréola dourada/coroa), Sacramentos (concha de batismo com água), Vocação (bússola com cruz), Proteção (anjo da guarda), Refeição (mesa com pão e prato), Manhã (sol nascendo), Noite (lua e estrelas), Família (família reunida), Amigos (duas crianças de mãos dadas), Escola (mochila e livros), Gratidão (mãos em prece com brilhos), Saúde (coração com curativo).

## Layout
- Imagem quadrada ~56px no lugar do ícone, nome embaixo como hoje.
- O selo com a quantidade de favoritos continua sobre a estrela.
- Card selecionado mantém o anel violeta; os outros ficam normais.

## Detalhes técnicos
- Gerar via imagegen com fundo transparente, enviar com `lovable-assets` para `src/assets/oracoes/categorias/{id}.png.asset.json`.
- `CategoryGrid.tsx`: resolver imagens por `import.meta.glob` pelo `id` da categoria (fallback para o ícone atual se faltar).
