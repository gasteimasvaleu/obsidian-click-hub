

# Ajustar imagens para vazar apenas no topo dos cards

## Problema atual
As imagens estao posicionadas com `bottom-0`, fazendo com que fiquem alinhadas na base do card e vazem para cima. Porem, como o card tem `overflow-visible`, a parte inferior tambem pode vazar dependendo do tamanho.

## Solucao
Trocar o posicionamento das imagens de `bottom-0` para usar alinhamento pela base do card, garantindo que a parte inferior da imagem fique dentro do card e apenas o topo vaze para fora.

### Card principal (linha 70)
De:
```tsx
className="absolute left-2 bottom-0 h-[130px] w-auto object-contain pointer-events-none"
```
Para:
```tsx
className="absolute left-2 bottom-2 h-[130px] w-auto object-contain pointer-events-none"
```

### Cards do grid - imagem (linha 91)
De:
```tsx
className="absolute left-1 bottom-0 h-[110px] w-auto object-contain pointer-events-none"
```
Para:
```tsx
className="absolute left-1 bottom-2 h-[110px] w-auto object-contain pointer-events-none"
```

### Cards do grid - placeholder icon (linha 97)
De:
```tsx
className="absolute left-1 bottom-0 h-[110px] w-[58px] flex items-end"
```
Para:
```tsx
className="absolute left-1 bottom-2 h-[110px] w-[58px] flex items-end"
```

Isso move as imagens levemente para cima dentro do card, mantendo a base da imagem dentro dos limites do card enquanto a parte superior continua vazando acima.

