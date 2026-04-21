

## Corrigir erro do `workbox-window` faltando

O Vite está reclamando que falta o pacote `workbox-window`, que o `vite-plugin-pwa` precisa para registrar o Service Worker. Além disso, segundo as boas práticas do Lovable, o Service Worker **não deve rodar dentro do preview** (causa cache que quebra o hot reload).

### O que vou fazer

**1. Desabilitar o PWA em modo de desenvolvimento**

No `vite.config.ts`, mudar:
```ts
devOptions: {
  enabled: true,   // ← causa o erro no preview
  type: 'module'
}
```
Para:
```ts
devOptions: {
  enabled: false
}
```

Isso faz o Service Worker rodar **apenas em produção** (build do app iOS/Android e site publicado). O preview do Lovable para de tentar carregar `workbox-window` e o erro some.

**2. Proteger o `main.tsx` contra registro do SW dentro de iframe**

Adicionar guard no `src/main.tsx` para que o `registerSW()` só execute quando **não** estiver em iframe nem em hostname de preview do Lovable. Em preview, qualquer Service Worker já registrado é desregistrado automaticamente.

### Por que não simplesmente instalar o `workbox-window`

Instalar resolveria o erro imediato, mas o Service Worker continuaria rodando no preview e cacheando o bundle — quebrando o hot reload e fazendo as próximas alterações **não aparecerem** sem hard refresh. A solução correta é desabilitar em dev (é exatamente o que a documentação interna do Lovable recomenda).

### Impacto em produção

Zero. PWA continua funcionando normalmente:
- No app iOS/Android nativo (Capacitor) — o `dist` é buildado com PWA ativo.
- No site publicado (`bibliatoonclub.com`) — idem.

### Resumo da mudança

| Arquivo | O que muda |
|---|---|
| `vite.config.ts` | `devOptions.enabled` de `true` → `false` |
| `src/main.tsx` | Adiciona guard que pula `registerSW` em iframe/preview |

### O que você faz depois (no terminal)

Como o `node_modules` do preview Lovable já está corrompido, depois que eu aplicar o fix:
1. O preview do Lovable se reconstrói sozinho — basta atualizar.
2. Localmente no Mac: `git pull && npm install && npm run sync:ios`.

