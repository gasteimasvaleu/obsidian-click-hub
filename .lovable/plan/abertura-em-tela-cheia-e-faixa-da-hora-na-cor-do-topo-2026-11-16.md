# Abertura em tela cheia e faixa da hora na cor do topo

## O que muda para você
1. **Abertura (imagem e vídeo):** passam a ocupar a tela inteira do celular, de cima a baixo. Hoje sobram faixas brancas em cima e embaixo. Para preencher a tela, as laterais do vídeo podem ser cortadas um pouco.
2. **Faixa da hora:** a área do relógio, do sinal e da bateria fica da mesma cor do topo do app (branco), sem a faixa cinza que aparece hoje.

## Como faremos
- **Vídeo e imagem de abertura no app:** trocar o modo "caber inteiro" pelo modo "preencher a tela" e estender até as bordas físicas do celular, incluindo atrás da hora e da barrinha de baixo.
- **Faixa da hora:** hoje o app reserva aquele espaço e o pinta com a cor do fundo da página (cinza). O topo do app vai passar a se estender por trás da hora, com a mesma cor branca do topo. O conteúdo continua começando abaixo do relógio. As outras telas sem o topo padrão (login, Paywall, chat) já respeitam esse espaço e serão conferidas uma a uma.
- **Imagem nativa (o primeiro quadro):** ela já está configurada para preencher a tela. Se ainda aparecer com bordas, confiro no aparelho do Xcode depois do teste.
- **Versões:** iOS 1.5 build 42 e Android 2.3.1 código 12, para reenviar.

## Importante
- A mudança da faixa da hora mexe em uma configuração do app nativo. Por isso ela só aparece depois de gerar um novo build (rodar `npm run sync:ios` e enviar). Uma atualização pelo Appflow sozinha não basta.
- A abertura em tela cheia chega também pela atualização do Appflow.

## Detalhes técnicos
- `capacitor.config.ts`: `ios.contentInset` de `'always'` para `'never'`.
- `src/index.css`: remover `padding-top: env(safe-area-inset-top)` do body. Navbar (`FuturisticNavbar`) já usa `pt-[max(0.5rem,env(safe-area-inset-top))]`. Conferir a compensação do `main` (pt) nos layouts, além de `AdminHeader`, `ExternalFrame`, `ChatInterface`, Login e Paywall.
- `SplashScreen.tsx`: `object-contain` para `object-cover` na imagem e no vídeo, container `fixed inset-0` com `h-[100dvh]`.
- Validar no Playwright com viewport 393x852 (com e sem safe-area simulada).
