# Botões da publicação no padrão do app

Trocar "Foto" (solto, cinza) e "Publicar" (verde-azulado) por uma barra arredondada única, dividida ao meio, com a largura do card.

## O que muda
- Metade esquerda: ícone de foto + "Foto", em cinza, com fundo violeta clarinho ao tocar.
- Metade direita: ícone de enviar + "Publicar", em violeta e negrito. Quando estiver publicando, aparece o ícone girando. Fica apagado enquanto não houver texto ou foto.
- Os dois com a mesma altura (44px). O degradê verde sai.

## Detalhes técnicos
- `src/components/comunidade/PostForm.tsx`: substituir os dois `Button` por `div flex w-full overflow-hidden rounded-full border border-border bg-card divide-x divide-border` com dois `button h-11 flex-1`. Publicar: `text-primary font-semibold disabled:opacity-50`. O input de arquivo continua escondido.
