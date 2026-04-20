

## Por que antes funcionava e agora não?

Resposta direta: **o código React dos vídeos não mudou**. O que mudou foi o **ambiente nativo iOS** entre o build anterior e o build atual. Três fatores combinados explicam a regressão:

### 1. Rebuild nativo regenerou `capacitor.config.json` com defaults atuais

Nos últimos dias rodamos `npm run sync:ios` várias vezes (correções da Play Store, bump de versão, fix do safe-area). Cada `cap sync` regenera `ios/App/App/capacitor.config.json` a partir do `capacitor.config.ts`.

Como **`allowsInlineMediaPlayback` nunca esteve declarado** no `capacitor.config.ts`, o valor aplicado é o default da versão do `@capacitor/ios` instalada. Em versões recentes do Capacitor + iOS 17/18, o default ficou mais restritivo — autoplay inline passou a exigir declaração explícita.

O build antigo no aparelho herdava um `capacitor.config.json` gerado em outra época, com comportamento diferente. Ao reinstalar via Xcode, o novo config sobrescreveu o antigo.

### 2. Atualização do iOS no aparelho

WebKit/WKWebView recebe atualizações de política de autoplay junto com cada versão do iOS. Apple endureceu a regra de "user gesture required" para `<video autoplay>` mesmo `muted` quando o atributo `webkit-playsinline` não está presente como atributo HTML literal. React converte `playsInline` (camelCase) para `playsinline` minúsculo, mas **não emite `webkit-playsinline`** — esse atributo legado precisa ser passado manualmente em JSX.

Builds antigos rodando em iOS mais antigo toleravam a ausência. iOS atual não tolera mais.

### 3. Service Worker / cache do app

A remoção do `padding-bottom` do body forçou o app a baixar novo HTML/CSS via `NetworkFirst`. Isso disparou um ciclo de atualização que também invalidou caches do WKWebView, fazendo o WebKit reavaliar permissões de mídia "do zero" — sem o gesto de instalação anterior que vinha dando "permissão herdada".

---

### Por que "funciona ao trocar de página"?

Quando você navega (tap na navbar), o WebKit registra um **user gesture**. A próxima chamada de `play()` dentro daquela janela de gesto é autorizada. Como o `<video>` da splash e do hero remontam ao trocar rotas, eles "pegam carona" no gesto e tocam. No primeiro mount após cold start, não há gesto — daí o botão de play.

---

### Em resumo

| Antes | Agora |
|---|---|
| Config nativa antiga + iOS antigo | Config nativa regenerada + iOS atualizado |
| WebKit tolerava ausência de `webkit-playsinline` | WebKit exige o atributo legado |
| Cache do WKWebView com permissão herdada | Cache invalidado, regras reaplicadas do zero |

Não houve "quebra de código" — houve **endurecimento de política do iOS** que expôs três configurações ausentes que sempre estiveram lá, mas eram toleradas.

A correção proposta no plano anterior (`allowsInlineMediaPlayback: true` + `webkit-playsinline=""` + `play()` defensivo via ref) ataca exatamente as três causas e devolve o comportamento anterior — agora de forma explícita e à prova de futuras atualizações do iOS.

