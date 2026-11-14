# Desenhos 2D nos cards "Transformar Foto" e "Minhas Criações"

Trocar os ícones (câmera e pasta em círculo colorido) por desenhos 2D no mesmo estilo dos usados nas categorias de Orações (cartoon, fundo transparente, detalhes em violeta):
- **Transformar Foto:** câmera fofa com uma foto saindo virando desenho para colorir.
- **Minhas Criações:** pasta violeta com desenhos coloridos e lápis de cor.

Imagem com cerca de 64px no lugar do círculo, nome embaixo como hoje.

## Detalhes técnicos
- Gerar com o mesmo fluxo de /tmp/orcat (fundo magenta + recorte), enviar via `lovable-assets` para `src/assets/colorir/{transformar-foto,minhas-criacoes}.png.asset.json`.
- `ColorirPage.tsx`: substituir os dois `div` com gradiente + ícone por `<img className="mb-3 h-16 w-16 object-contain" />`.
