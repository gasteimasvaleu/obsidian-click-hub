# Vídeo da tela inicial na largura dos cards (iPad e computador)

Hoje o card do vídeo fica limitado a 500px de largura e 260px de altura, por isso parece pequeno e com faixas vazias no iPad e no computador, enquanto os cards de baixo ocupam a largura toda.

## O que muda
- No iPad e no computador, o card do vídeo passa a ter a mesma largura dos cards abaixo dele.
- O vídeo preenche o card inteiro no formato 16:9, sem faixas vazias.
- No celular fica como está.

## Detalhes técnicos
- `Index.tsx`: wrapper com `max-w-[500px] md:max-w-none`; no vídeo, `max-h-[260px]` passa a valer só abaixo de md, e a partir de md o vídeo usa `aspect-video object-cover`.
