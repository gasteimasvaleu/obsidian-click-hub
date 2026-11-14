# Deixar o frei do login do mesmo tamanho de antes

A imagem antiga era quase quadrada, então, na mesma largura, aparecia bem mais alta. A nova é larga e tem muito espaço vazio nas laterais, por isso o frei ficou pequeno.

## Mudança
- Cortar as sobras vazias das laterais da nova imagem, preservando o frei, a placa e a maior parte do brilho dourado.
- Exibir a imagem com a mesma altura de antes (cerca de 300px), para o frei ocupar o mesmo espaço no card.

## Detalhes técnicos
- Recortar o PNG com Pillow para uma proporção próxima à da imagem antiga (810x941), centralizado no frei, e enviá-lo como novo asset (`frei-boas-vindas-placa-recorte.png.asset.json`), apagando o asset anterior.
- `src/pages/Login.tsx`: trocar o import e usar `mx-auto w-full max-w-[18rem] object-contain` (ajustado para dar a mesma altura de antes).
- Conferir com uma captura em 393px de largura, comparando com a imagem antiga.
