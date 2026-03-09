

## Loading Overlay Global — Vídeo MP4 + Barra de Progresso

### O que será criado

1. **`src/components/LoadingOverlay.tsx`**
   - Tela fixa `bg-black` sólido, `fixed inset-0 z-[9999]`
   - `<video>` com `loading2.mp4` — `autoPlay`, `muted`, `playsInline`, `loop`
   - Abaixo do vídeo: barra de progresso indeterminada (animação CSS — barra que desliza da esquerda para direita em loop, cor `primary`)
   - Texto opcional (mensagem) abaixo da barra
   - Fade-in/fade-out de 300ms

2. **`src/contexts/LoadingContext.tsx`**
   - `showLoading(message?: string)` e `hideLoading()`
   - Renderiza `<LoadingOverlay>` condicionalmente
   - Hook `useLoading()` para qualquer componente

3. **`App.tsx`** — envolver com `<LoadingProvider>`

### Onde será aplicado

| Página | Ação | Arquivo |
|--------|------|---------|
| Colorir — Salvar | Upload + save | `ColoringEditorPage.tsx` |
| Colorir — Transformar foto | Edge function IA | `PhotoUploader.tsx` |
| Devocional | Gerar devocional | `DailyDevotionalPage.tsx` |
| Guia para Pais | Gerar guia com IA | `GuiaPais.tsx` |
| Amigo Divino — Chat | Envio de mensagem | `ChatInterface.tsx` |
| Perfil — WhatsApp | Salvar preferências | `WhatsAppOptinSection.tsx` |
| Games — Players | Carregando jogo | `GamePlayer.tsx`, `MemoryPlayer.tsx`, `WordSearchPlayer.tsx`, `QuizPlayer.tsx`, `PuzzlePlayer.tsx` |
| Bíblia — Leitor | Carregando capítulo | `ChapterReaderPage.tsx` |

Em cada arquivo, os estados locais de loading (`setSaving(true)`, `setIsGenerating(true)`, etc.) serão complementados com `showLoading("mensagem")` no início da ação e `hideLoading()` no final (success ou error). Os skeletons/spinners locais continuam para carregamento inicial de página; o overlay cobre apenas **ações do usuário** (salvar, gerar, enviar).

### Vídeo

URL: `https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/loading2.mp4`

### Detalhes da barra de progresso

Barra indeterminada com CSS `@keyframes` — uma faixa de ~30% da largura que desliza continuamente da esquerda para direita, cor gradiente usando `primary`. Largura total: ~60% da tela (max 300px), altura 4px, border-radius full.

