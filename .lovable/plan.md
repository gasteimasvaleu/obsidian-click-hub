# Corrigir: TestFlight abre com as telas antigas (mantendo o Appflow)

## O que está acontecendo
A atualização ao vivo do Appflow (canal "Production") continua ligada. Ao abrir, o app baixa a última versão web publicada lá e ela substitui as telas novas do build 40. Como a última publicação no Appflow é anterior às mudanças, o app mostra as telas antigas. O ícone não passa pelo Appflow, por isso só ele mudou.

## Solução (sem mudar código nem enviar build novo)
1. No Appflow, abra o app e vá em **Builds > New build**.
2. Escolha o commit mais recente (o de hoje), tipo **Web**.
3. Em **Live Update**, marque o canal **Production** e inicie o build.
4. Quando terminar, confira em **Deployments** que o canal Production aponta para esse build.
5. No iPhone: feche o app por completo e abra duas vezes (a primeira baixa, a segunda já mostra). Se não mudar, apague e instale de novo pelo TestFlight.

O mesmo vale para o Android: os dois leem o mesmo canal.

## Daqui para frente
Sempre que fizermos mudanças, gere um novo build Web no Appflow e publique no canal Production; senão os celulares continuam com a versão anterior.

## Detalhes técnicos
- `src/main.tsx` chama `LiveUpdates.sync()` e `reload()` uma vez por sessão; `capacitor.config.ts` usa appId `688c8cc6`, canal `Production`. Nada será alterado.
