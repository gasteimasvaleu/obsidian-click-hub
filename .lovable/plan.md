# Player completo direto, sem capa e mais compacto

## O que muda
- **Abre direto:** ao tocar uma música, o player completo aparece na hora, sem passar pela barrinha. A seta para baixo continua levando à barrinha, se quiser minimizar.
- **Sem imagem da música:** a capa sai do player completo.
- **Ondas sonoras em 16:9:** no lugar da capa entra um card largo (16:9) com borda violeta e as barras do equalizador grandes, ocupando o card todo e se mexendo enquanto a música toca (paradas e baixinhas na pausa).
- **Card mais baixo:** menos espaço entre título, barra de tempo e botões; a descrição continua fechada em 3 linhas com "Ver mais".

## Detalhes técnicos
- `AudioPlayer.tsx`: `useState(true)` em `expanded` e reabrir (`setExpanded(true)`) quando `currentTrack.id` mudar; remover `Cover` do modo expandido; reduzir `mb-6` para `mb-3/4`, botão play `h-14`.
- `AudioEqualizer.tsx`: prop `size="lg"` com ~24 barras `w-2`, altura `h-full`; nova keyframe `equalizer-lg` em `index.css` animando a altura de 10% a 100% (usando `height` em %), dentro de `aspect-video rounded-3xl border border-primary/30 bg-primary/5`.
