# Narração do Terço mais rápida

- A voz das orações e dos mistérios passa a tocar **20% mais rápida** (1,2x), sem ficar com voz fina: o tom da voz continua o mesmo.
- Vale para todas as orações (Ave-Maria, Pai-Nosso, Creio etc.) e para os anúncios dos mistérios.
- Se ainda achar lenta ou rápida demais, é só me dizer outro valor (por exemplo 1,1x ou 1,3x).

## Detalhes técnicos
- Em `src/pages/Terco.tsx`, ao criar/tocar o áudio: `audio.playbackRate = 1.2` e `audio.preservesPitch = true` (com `webkitPreservesPitch` para Safari/iOS), reaplicado a cada troca de faixa.
- Constante `NARRATION_RATE = 1.2` para ajustar fácil. Os MP3 em `public/terco/` não mudam.
