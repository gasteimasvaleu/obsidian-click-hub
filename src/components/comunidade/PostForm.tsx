import { useState, useRef } from "react";
import { ImagePlus, Send, X, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Textarea } from "@/components/ui/textarea";
import { uploadMedia, IMAGE_TYPES } from "@/lib/uploadMedia";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const MAX_CONTENT_LENGTH = 500;
const MAX_IMAGE_SIZE_MB = 5;

export const PostForm = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");
      if (!content.trim() && !imageFile) throw new Error("Adicione texto ou uma imagem");

      let imageUrl: string | undefined;

      if (imageFile) {
        const result = await uploadMedia({
          file: imageFile,
          bucket: "community",
          folder: user.id,
          maxSizeMB: MAX_IMAGE_SIZE_MB,
          acceptedTypes: IMAGE_TYPES,
        });
        if (!result.success) throw new Error(result.error);
        imageUrl = result.url;
      }

      const { error } = await supabase.from("community_posts").insert({
        user_id: user.id,
        content: content.trim(),
        image_url: imageUrl || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("Post publicado!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao publicar post");
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Imagem muito grande. Máximo: ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error("Formato não suportado. Use PNG, JPG ou WEBP");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canSubmit = (content.trim().length > 0 || imageFile !== null) && !createPostMutation.isPending;

  return (
    <GlassCard className="space-y-3">
      <Textarea
        placeholder="Compartilhe algo com a comunidade..."
        value={content}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CONTENT_LENGTH) {
            setContent(e.target.value);
          }
        }}
        className="bg-muted border-border text-foreground placeholder:text-muted-foreground resize-none min-h-[80px]"
        maxLength={MAX_CONTENT_LENGTH}
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{content.length}/{MAX_CONTENT_LENGTH}</span>
      </div>

      {imagePreview && (
        <div className="relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-48 rounded-lg object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute top-1 right-1 bg-black/70 rounded-full p-1 hover:bg-red-500/80 transition-colors"
          >
            <X size={14} className="text-foreground" />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleImageSelect}
        className="hidden"
      />
      <div className="flex w-full overflow-hidden rounded-full border border-border bg-card divide-x divide-border">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-11 flex-1 items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <ImagePlus size={18} />
          Foto
        </button>
        <button
          type="button"
          onClick={() => createPostMutation.mutate()}
          disabled={!canSubmit}
          className="flex h-11 flex-1 items-center justify-center gap-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-50"
        >
          {createPostMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          Publicar
        </button>
      </div>
    </GlassCard>
  );
};
