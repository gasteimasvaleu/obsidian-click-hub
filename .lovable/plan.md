

## Corrigir Cache de Imagens no PWA

### Problema Identificado

As imagens do Supabase Storage estão aparecendo pela metade porque:
1. Não existe regra de cache específica para imagens do Supabase
2. Imagens grandes podem ter download interrompido
3. O navegador/PWA pode exibir imagens parcialmente baixadas

### Solução

Adicionar regra de cache `StaleWhileRevalidate` para imagens do Supabase Storage no Service Worker.

### Estrutura do Cache Atual vs Proposta

```text
ATUAL:
+---------------------------+----------------+
| Tipo de Conteúdo          | Estratégia     |
+---------------------------+----------------+
| Google Fonts              | CacheFirst     |
| Vídeos locais             | CacheFirst     |
| Vídeos Supabase           | CacheFirst     |
| API Supabase              | NetworkFirst   |
| Imagens Supabase          | (SEM CACHE!)   |
+---------------------------+----------------+

PROPOSTO:
+---------------------------+-------------------+
| Tipo de Conteúdo          | Estratégia        |
+---------------------------+-------------------+
| Google Fonts              | CacheFirst        |
| Vídeos locais             | CacheFirst        |
| Vídeos Supabase           | CacheFirst        |
| API Supabase              | NetworkFirst      |
| Imagens Supabase          | StaleWhileRevalid.|  <-- NOVO
+---------------------------+-------------------+
```

### Alteração Técnica

**Arquivo:** `vite.config.ts`

Adicionar nova regra de `runtimeCaching` para imagens do Supabase Storage:

```typescript
{
  urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*\.(?:png|jpg|jpeg|webp|gif|svg)/i,
  handler: 'StaleWhileRevalidate',
  options: {
    cacheName: 'supabase-images-cache',
    expiration: {
      maxEntries: 100,
      maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
    },
    cacheableResponse: {
      statuses: [0, 200]
    }
  }
}
```

### Por que StaleWhileRevalidate?

- **CacheFirst**: Pode servir imagens desatualizadas se o admin trocar um banner
- **NetworkFirst**: Lento em conexões ruins, causa o problema atual
- **StaleWhileRevalidate**: Serve imagem cacheada instantaneamente E atualiza em background - melhor dos dois mundos

### Benefícios

1. Imagens carregam instantaneamente do cache
2. Atualizações são baixadas em background
3. Evita downloads incompletos sendo exibidos
4. Melhora significativa na experiência offline
5. Imagens do admin (thumbnails, banners) funcionam corretamente

### Comportamento Esperado Após a Correção

- Primeira visita: imagem baixa da rede normalmente
- Visitas seguintes: imagem aparece instantaneamente do cache
- Se a imagem foi atualizada no servidor: atualiza em background para próxima visita
- Offline: imagens já visitadas funcionam perfeitamente

