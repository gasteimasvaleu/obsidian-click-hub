import { useState } from "react";
import { Heart, MessageCircle, Trash2, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentSection } from "./CommentSection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { deleteMedia } from "@/lib/uploadMedia";

interface PostCardProps {
  post: {
    id: string;
    user_id: string;
    content: string;
    image_url: string | null;
    likes_count: number;
    created_at: string;
    profiles?: {
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  };
  isLiked: boolean;
}

export const PostCard = ({ post, isLiked }: PostCardProps) => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const isOwner = user?.id === post.user_id;
  const canDelete = isOwner || isAdmin;

  const authorName = post.profiles?.full_name || "Usuário";
  const avatarUrl = post.profiles?.avatar_url;
  const initials = authorName.slice(0, 2).toUpperCase();

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Não autenticado");

      if (liked) {
        const { error } = await supabase
          .from("community_likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("community_likes")
          .insert({ post_id: post.id, user_id: user.id });
        if (error) throw error;
      }
    },
    onMutate: () => {
      setLiked(!liked);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    },
    onError: () => {
      setLiked(liked);
      setLikesCount(post.likes_count);
      toast.error("Erro ao curtir");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["community-user-likes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (post.image_url) {
        await deleteMedia("community", post.image_url);
      }

      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", post.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("Post removido");
    },
    onError: () => {
      toast.error("Erro ao remover post");
    },
  });

  return (
    <GlassCard className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback className="bg-white/10 text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white text-sm font-semibold">{authorName}</p>
            <p className="text-white/40 text-xs">{timeAgo}</p>
          </div>
        </div>

        {canDelete && (
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="text-white/30 hover:text-red-400 transition-colors p-1"
          >
            {deleteMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      {post.content && (
        <p className="text-white/90 text-sm whitespace-pre-wrap break-words">
          {post.content}
        </p>
      )}

      {/* Image */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt="Post"
          className="w-full rounded-lg object-cover max-h-80"
          loading="lazy"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
          className="flex items-center gap-1.5 transition-colors group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={liked ? "liked" : "not-liked"}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <Heart
                size={18}
                className={
                  liked
                    ? "text-red-500 fill-red-500"
                    : "text-white/50 group-hover:text-red-400"
                }
              />
            </motion.div>
          </AnimatePresence>
          <span
            className={`text-xs ${liked ? "text-red-400" : "text-white/50"}`}
          >
            {likesCount}
          </span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-white/50 hover:text-emerald-400 transition-colors"
        >
          <MessageCircle size={18} />
          <span className="text-xs">Comentar</span>
        </button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CommentSection postId={post.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};
