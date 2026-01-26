

## Corrigir Player de Vídeo no PWA - Suporte a Range Requests

### Problema Identificado

O Service Worker configurado pelo VitePWA não está tratando corretamente os **Range Requests** (HTTP 206 Partial Content), que são essenciais para o streaming progressivo de vídeos. 

Quando um vídeo HTML5 é reproduzido, o navegador faz requisições parciais (range requests) para carregar o vídeo em chunks. Se o Service Worker intercepta essas requisições mas não as processa corretamente, o vídeo para de funcionar quando tenta acessar partes ainda não carregadas.

---

### Solução

Precisamos fazer duas alterações principais:

---

### 1. Atualizar a configuração do VitePWA para suportar Range Requests

**Arquivo:** `vite.config.ts`

Adicionar configuração de runtime caching específica para vídeos com suporte a range requests:

```typescript
runtimeCaching: [
  // ... configurações existentes de fonts e supabase ...
  
  // Adicionar: Configuração para vídeos com Range Requests
  {
    urlPattern: /\.(?:mp4|webm|ogg|mov)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'video-cache',
      rangeRequests: true,  // Habilita o plugin de Range Requests
      expiration: {
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 7 // 7 dias
      },
      cacheableResponse: {
        statuses: [0, 200]
      }
    }
  },
  
  // Adicionar: Configuração para vídeos do Supabase Storage com Range Requests
  {
    urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*\.(?:mp4|webm|ogg|mov)$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'supabase-video-cache',
      rangeRequests: true,  // Habilita o plugin de Range Requests
      networkTimeoutSeconds: 10,
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 7 // 7 dias
      },
      cacheableResponse: {
        statuses: [0, 200]
      }
    }
  }
]
```

---

### 2. Adicionar tratamento de erros no componente de vídeo

**Arquivo:** `src/components/plataforma/LessonPlayer.tsx`

Melhorar o elemento `<video>` para lidar com erros de carregamento e eventos de buffering:

```typescript
// Adicionar state para erro
const [videoError, setVideoError] = useState(false);
const [isBuffering, setIsBuffering] = useState(false);

// No renderVideo(), melhorar o elemento video:
<video
  src={videoUrl}
  controls
  controlsList="nodownload"
  className="w-full h-full object-contain bg-black"
  preload="metadata"  // Carrega apenas metadados inicialmente
  onError={(e) => {
    console.error("Video error:", e);
    setVideoError(true);
  }}
  onWaiting={() => setIsBuffering(true)}
  onPlaying={() => setIsBuffering(false)}
  onStalled={() => {
    console.warn("Video stalled - network issue");
  }}
>
  Seu navegador não suporta o elemento de vídeo.
</video>

// Adicionar UI para estado de erro
{videoError && (
  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4">
    <p className="text-white">Erro ao carregar o vídeo</p>
    <Button onClick={() => window.location.reload()}>
      Tentar novamente
    </Button>
  </div>
)}
```

---

### 3. (Opcional) Atualizar outros players de vídeo

Os mesmos tratamentos devem ser aplicados a outros componentes que usam vídeo:

- `src/components/SplashScreen.tsx` - Splash screen com vídeo
- `src/components/plataforma/ResponsiveHeroBanner.tsx` - Banner com vídeo
- `src/pages/biblia/BibliaPage.tsx` - Animação de vídeo
- `src/pages/Games.tsx` - Animação de vídeo

---

### Resumo das Mudanças

| Arquivo | Alteração |
|---------|-----------|
| `vite.config.ts` | Adicionar regras de caching para vídeos com `rangeRequests: true` |
| `src/components/plataforma/LessonPlayer.tsx` | Adicionar handlers de erro e buffering no elemento video |
| Outros componentes (opcional) | Aplicar os mesmos tratamentos de erro |

---

### Detalhes Técnicos

**Por que isso resolve o problema:**

1. **Range Requests Plugin**: O Workbox tem um plugin específico (`rangeRequests: true`) que intercepta requisições com header `Range` e retorna corretamente respostas HTTP 206 (Partial Content), permitindo que o vídeo carregue progressivamente.

2. **Preload metadata**: Usar `preload="metadata"` ao invés do padrão faz o navegador carregar apenas informações básicas inicialmente, e depois carregar o conteúdo sob demanda.

3. **Tratamento de erros**: Os eventos `onError`, `onWaiting` e `onStalled` permitem mostrar feedback ao usuário quando há problemas de rede.

4. **Cache separado para vídeos**: Manter vídeos em um cache separado com políticas específicas evita conflitos com outros recursos.

---

### Observação Importante

Após implementar essas mudanças, os usuários do PWA precisarão:
1. Fechar completamente o app PWA
2. Reabrir para que o novo Service Worker seja instalado
3. O vídeo deve funcionar corretamente após a atualização

