

## Preview de Vídeo YouTube no Formulário de Aulas

### Objetivo
Adicionar um preview em tempo real do vídeo do YouTube no modal de inclusão/edição de aulas, permitindo que o administrador visualize o vídeo antes de salvar.

---

### Mudanças Planejadas

**Arquivo:** `src/pages/admin/plataforma/LessonsManager.tsx`

1. **Criar função de extração de ID do YouTube**
   - Reutilizar a lógica existente em `LessonPlayer.tsx`
   - Detectar URLs do YouTube (youtube.com e youtu.be)
   - Extrair o videoId para gerar o embed

2. **Adicionar componente de preview inline**
   - Exibir iframe do YouTube abaixo do campo de URL
   - Mostrar preview automaticamente quando URL válida é detectada
   - Proporção 16:9 para manter consistência visual

3. **Melhorar validação visual**
   - Indicador de URL válida/inválida
   - Mensagem de erro para URLs inválidas
   - Suporte também para Vimeo (bonus)

---

### Interface Proposta

```text
┌─────────────────────────────────────────────────┐
│  URL do Vídeo (YouTube/Vimeo)                   │
│  ┌─────────────────────────────────────────────┐│
│  │ https://youtube.com/watch?v=abc123         ││
│  └─────────────────────────────────────────────┘│
│  ✓ Vídeo detectado                              │
│  ┌─────────────────────────────────────────────┐│
│  │                                             ││
│  │         [YouTube Player Embed]              ││
│  │                                             ││
│  └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

---

### Detalhes Técnicos

**Funções auxiliares a adicionar:**

```typescript
const extractVideoId = (url: string) => {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (ytMatch) return { type: "youtube", id: ytMatch[1] };

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return { type: "vimeo", id: vimeoMatch[1] };

  return null;
};

const getEmbedUrl = (videoInfo: { type: string; id: string }) => {
  if (videoInfo.type === "youtube") {
    return `https://www.youtube.com/embed/${videoInfo.id}`;
  }
  if (videoInfo.type === "vimeo") {
    return `https://player.vimeo.com/video/${videoInfo.id}`;
  }
  return null;
};
```

**Componente de preview (inline no formulário):**

```tsx
{formData.video_source === "external" && (
  <div className="space-y-3">
    <Label>URL do Vídeo (YouTube/Vimeo)</Label>
    <Input
      placeholder="https://youtube.com/watch?v=..."
      value={formData.video_url || ""}
      onChange={(e) =>
        setFormData({ ...formData, video_url: e.target.value })
      }
    />
    
    {/* Preview */}
    {videoInfo && (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          Vídeo {videoInfo.type === "youtube" ? "YouTube" : "Vimeo"} detectado
        </div>
        <AspectRatio ratio={16 / 9} className="bg-black rounded-lg overflow-hidden">
          <iframe
            src={getEmbedUrl(videoInfo)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media"
            allowFullScreen
          />
        </AspectRatio>
      </div>
    )}
    
    {formData.video_url && !videoInfo && (
      <p className="text-sm text-destructive">
        URL não reconhecida. Use links do YouTube ou Vimeo.
      </p>
    )}
  </div>
)}
```

---

### Imports Necessários

Adicionar ao arquivo:
- `Check` do lucide-react (para indicador de sucesso)
- `AspectRatio` de `@/components/ui/aspect-ratio`

---

### Benefícios

- Feedback visual imediato antes de salvar
- Validação de URL em tempo real
- Confirmação de que o vídeo correto foi selecionado
- Experiência de administração mais intuitiva

