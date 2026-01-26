

## Reativar Cache de Vídeos com Suporte Correto a Range Requests

### Contexto

Removemos o cache de vídeos para resolver o problema de fullscreen no iOS, mas isso impacta a performance em reproduções subsequentes. A boa notícia é que o Workbox **tem suporte a Range Requests** através do plugin `RangeRequestsPlugin`, que pode ser ativado com a opção `rangeRequests: true`.

O problema anterior era que estávamos usando `rangeRequests: true` mas também tínhamos os vídeos na `navigateFallbackDenylist`, o que criava conflito. Agora que o player de vídeo está mais resiliente com a lógica de recovery implementada, podemos reativar o cache corretamente.

---

### Solução

Reconfigurar o cache de vídeos com as configurações corretas para Safari/iOS:

---

### Alterações

**Arquivo:** `vite.config.ts`

1. **Remover vídeos da `navigateFallbackDenylist`** - permitir que o SW intercepte
2. **Adicionar regra de cache para vídeos locais** com `rangeRequests: true`
3. **Adicionar regra de cache para vídeos do Supabase** com `rangeRequests: true`
4. **Usar `CacheFirst`** ao invés de `NetworkFirst` - prioriza cache para vídeos já baixados
5. **Adicionar `cacheableResponse` com status 200 apenas** - Safari requer isso

```typescript
workbox: {
  globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}'],
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
  cleanupOutdatedCaches: true,
  skipWaiting: true,
  clientsClaim: true,
  // REMOVER a navigateFallbackDenylist para vídeos
  
  runtimeCaching: [
    // ... fonts (manter igual) ...
    
    // Cache para vídeos com Range Requests
    {
      urlPattern: /\.(?:mp4|webm|ogg|mov)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'video-cache',
        rangeRequests: true,  // HABILITA o plugin de Range Requests
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 7 // 7 dias
        },
        cacheableResponse: {
          statuses: [200]  // Apenas 200, não 0 (importante para Safari)
        }
      }
    },
    
    // Cache para vídeos do Supabase Storage
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*\.(?:mp4|webm|ogg|mov)/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'supabase-video-cache',
        rangeRequests: true,  // HABILITA o plugin de Range Requests
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 7 // 7 dias
        },
        cacheableResponse: {
          statuses: [200]  // Apenas 200
        }
      }
    },
    
    // Supabase API (excluindo vídeos - já tratados acima)
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/(?!storage\/).*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5
        }
      }
    }
  ]
}
```

---

### Como funciona

1. **Primeira reprodução**: O vídeo é baixado da rede e armazenado no cache
2. **Segunda reprodução**: O Service Worker serve do cache, suportando Range Requests corretamente
3. **Range Requests**: O plugin do Workbox intercepta requests com header `Range` e retorna a porção correta do vídeo cacheado
4. **Recovery existente**: Se algo falhar, o `LessonPlayer` já tem lógica para tentar novamente

---

### Ordem das regras

A ordem é importante. As regras de vídeo devem vir **antes** da regra geral do Supabase para garantir que sejam correspondidas primeiro.

---

### Resumo

| Arquivo | Alteração |
|---------|-----------|
| `vite.config.ts` | Remover `navigateFallbackDenylist`, adicionar regras de cache com `rangeRequests: true` |

---

### Riscos e Mitigações

**Risco**: O problema de fullscreen pode voltar em alguns casos edge.

**Mitigação**: O `LessonPlayer` agora tem lógica de recovery que tenta retomar o vídeo automaticamente. Se o problema persistir em testes, podemos voltar à configuração anterior ou implementar HLS.

---

### Observação

Após o deploy, os usuários precisarão:
1. Fechar completamente o PWA
2. Reabrir para que o novo Service Worker seja instalado
3. Na primeira reprodução de cada vídeo, ele será baixado e cacheado
4. Reproduções subsequentes serão instantâneas do cache

