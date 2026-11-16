# Ajuste de velocidade da narração do Terço

- Abaixo dos botões **Narração** e **Recomeçar**, uma nova barra violeta no mesmo estilo, com as opções de velocidade: **0,8x · 1x · 1,2x · 1,5x**.
- A opção escolhida fica destacada e passa a valer na hora, para todas as orações e anúncios dos mistérios.
- A voz continua com o mesmo tom (não fica fina), só mais rápida ou mais lenta.
- O app lembra a velocidade escolhida para as próximas vezes. Começa em **1,2x**, já que a normal pareceu lenta.

## Detalhes técnicos
- `src/pages/Terco.tsx`: estado `rate` salvo em localStorage (`terco-rate`, padrão 1.2); barra com SPLIT_BAR de 4 botões abaixo da barra Narração/Recomeçar.
- Aplicar `audio.playbackRate = rate` e `preservesPitch`/`webkitPreservesPitch = true` em cada faixa e quando a velocidade mudar com áudio tocando. MP3 em `public/terco/` sem mudança.
