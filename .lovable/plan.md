

## Corrigir Saída Inesperada do Fullscreen no Player de Vídeo - iOS PWA

### Problema Identificado

No iOS, quando o player de vídeo HTML5 encontra um problema de buffering ou erro de rede durante a reprodução em **fullscreen**, o Safari força a saída do modo fullscreen automaticamente. Isso acontece porque:

1. O iOS tem controle nativo sobre o fullscreen do elemento `<video>`
2. Quando ocorre um erro de rede (evento `stalled` ou `error`), o iOS interpreta como falha e sai do fullscreen
3. O Service Worker pode estar interceptando range requests incorretamente, causando interrupções

---

### Solução

Precisamos implementar 3 melhorias:

---

### 1. Melhorar o tratamento de erros para não disparar em eventos transientes

**Arquivo:** `src/components/plataforma/LessonPlayer.tsx`

**Mudanças:**
- Adicionar debounce no evento `onStalled` para não reagir a pausas temporárias de rede
- Tentar retomar a reprodução automaticamente quando o evento `stalled` for disparado
- Usar `onSuspend` para detectar quando o navegador está pausando o download propositalmente
- Adicionar evento `onCanPlayThrough` para limpar estados de erro

```typescript
// Adicionar ref para o elemento video
const videoRef = useRef<HTMLVideoElement>(null);
const [stallCount, setStallCount] = useState(0);

// Função para tentar retomar reprodução
const handleStalled = () => {
  console.warn("Video stalled - attempting recovery");
  setStallCount(prev => prev + 1);
  
  // Após 3 stalls consecutivos, mostrar aviso
  if (stallCount >= 3) {
    setIsBuffering(true);
  }
  
  // Tentar retomar
  if (videoRef.current && !videoRef.current.paused) {
    const currentTime = videoRef.current.currentTime;
    videoRef.current.load();
    videoRef.current.currentTime = currentTime;
    videoRef.current.play().catch(() => {});
  }
};

// Limpar contador quando vídeo toca normalmente
const handlePlaying = () => {
  setIsBuffering(false);
  setVideoError(false);
  setStallCount(0);
};
```

---

### 2. Adicionar lógica de retry automático para problemas de rede

**Arquivo:** `src/components/plataforma/LessonPlayer.tsx`

**Mudanças:**
- Implementar retry automático quando o vídeo para por problemas de rede
- Guardar a posição atual do vídeo antes de recarregar
- Usar `timeupdate` para salvar progresso continuamente

```typescript
const [lastPosition, setLastPosition] = useState(0);

// Salvar posição continuamente
const handleTimeUpdate = () => {
  if (videoRef.current) {
    setLastPosition(videoRef.current.currentTime);
  }
};

// No onError, tentar retomar da última posição
const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
  console.error("Video error:", e);
  
  // Tentar retomar automaticamente uma vez
  if (!videoError && videoRef.current) {
    const video = videoRef.current;
    video.load();
    video.currentTime = lastPosition;
    video.play().catch(() => setVideoError(true));
  } else {
    setVideoError(true);
  }
};
```

---

### 3. Usar atributos específicos para iOS no elemento video

**Arquivo:** `src/components/plataforma/LessonPlayer.tsx`

**Mudanças:**
- Adicionar `playsInline` para evitar que o iOS force fullscreen nativo
- Adicionar `webkit-playsinline` para compatibilidade
- Usar `x5-video-player-type="h5"` para melhor compatibilidade com WebViews

```tsx
<video
  ref={videoRef}
  src={videoUrl}
  controls
  controlsList="nodownload"
  playsInline
  webkit-playsinline="true"
  x5-video-player-type="h5"
  className="w-full h-full object-contain bg-black"
  preload="metadata"
  onError={handleError}
  onWaiting={() => setIsBuffering(true)}
  onPlaying={handlePlaying}
  onStalled={handleStalled}
  onTimeUpdate={handleTimeUpdate}
  onCanPlayThrough={() => setStallCount(0)}
>
  Seu navegador não suporta o elemento de vídeo.
</video>
```

---

### 4. Excluir vídeos do cache do Service Worker completamente

**Arquivo:** `vite.config.ts`

**Mudanças:**
- Remover as regras de runtimeCaching para vídeos
- Deixar o navegador lidar diretamente com os vídeos sem interceptação do SW
- Adicionar vídeos ao `navigateFallbackDenylist` para não serem interceptados

```typescript
// Remover as regras de cache de vídeo que adicionamos antes
// Ao invés de tentar cachear vídeos com range requests,
// é mais seguro deixar o navegador lidar diretamente

VitePWA({
  // ... outras configurações ...
  workbox: {
    // Adicionar vídeos à lista de exclusão
    navigateFallbackDenylist: [/\.(?:mp4|webm|ogg|mov)$/i],
    
    // Não pré-cachear vídeos
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,woff,woff2}'],
    
    // Manter apenas caches que não são de vídeo
    runtimeCaching: [
      // Fonts
      { /* ... manter configuração de fonts ... */ },
      // Supabase API (excluindo storage de vídeos)
      {
        urlPattern: /^https:\/\/fnksvazibtekphseknob\.supabase\.co\/(?!storage\/.*\.(?:mp4|webm|ogg|mov))/i,
        handler: 'NetworkFirst',
        options: { /* ... */ }
      }
    ]
  }
})
```

---

### Resumo das Alterações

| Arquivo | Alteração |
|---------|-----------|
| `src/components/plataforma/LessonPlayer.tsx` | Adicionar ref, retry automático, salvar posição, atributos iOS |
| `vite.config.ts` | Excluir vídeos do cache do SW completamente |

---

### Por que isso resolve o problema

1. **Exclusão do cache**: O Service Worker deixa de interceptar requisições de vídeo, eliminando problemas de range requests
2. **playsInline**: Evita comportamentos inesperados do fullscreen nativo do iOS
3. **Retry automático**: Se o vídeo parar por problema de rede, tenta retomar automaticamente
4. **Salvar posição**: Mesmo se precisar recarregar, volta para onde parou

---

### Alternativa: Usar HLS para streaming

Se os problemas persistirem, uma solução mais robusta seria converter os vídeos para HLS (HTTP Live Streaming) que é nativamente suportado pelo iOS e lida melhor com conexões instáveis. Isso requer:
- Conversão dos vídeos para formato HLS (.m3u8 + segments)
- Biblioteca como hls.js para suporte em outros navegadores

Essa seria uma mudança mais significativa para implementar posteriormente se necessário.

