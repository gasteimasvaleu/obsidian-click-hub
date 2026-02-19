import { useState, useRef } from "react";
import { ImagePlus, Send, X, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
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
        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none min-h-[80px]"
        maxLength={MAX_CONTENT_LENGTH}
      />

      <div className="flex items-center justify-between text-xs text-white/40">
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
            <X size={14} className="text-white" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageSelect}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ImagePlus size={18} className="mr-1" />
            Foto
          </Button>
        </div>

        <Button
          onClick={() => createPostMutation.mutate()}
          disabled={!canSubmit}
          size="sm"
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
        >
          {createPostMutation.isPending ? (
            <Loader2 size={16} className="animate-spin mr-1" />
          ) : (
            <Send size={16} className="mr-1" />
          )}
          Publicar
        </Button>
      </div>
    </GlassCard>
  );
};
