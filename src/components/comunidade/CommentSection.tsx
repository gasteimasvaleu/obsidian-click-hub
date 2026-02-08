import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommentItem } from "./CommentItem";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const MAX_COMMENT_LENGTH = 300;

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["community-comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_comments")
        .select("*, profiles:user_id(full_name, avatar_url)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Não autenticado");
      if (!newComment.trim()) throw new Error("Comentário vazio");

      const { error } = await supabase.from("community_comments").insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["community-comments", postId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao comentar");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("community_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-comments", postId] });
      toast.success("Comentário removido");
    },
    onError: () => {
      toast.error("Erro ao remover comentário");
    },
  });

  return (
    <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
      {isLoading ? (
        <div className="flex justify-center py-2">
          <Loader2 size={16} className="animate-spin text-white/40" />
        </div>
      ) : (
        <>
          {comments.length > 0 && (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {comments.map((comment: any) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={(id) => deleteCommentMutation.mutate(id)}
                  isDeleting={deleteCommentMutation.isPending}
                />
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex gap-2 items-center">
        <Input
          placeholder="Escreva um comentário..."
          value={newComment}
          onChange={(e) => {
            if (e.target.value.length <= MAX_COMMENT_LENGTH) {
              setNewComment(e.target.value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newComment.trim() && !addCommentMutation.isPending) {
              addCommentMutation.mutate();
            }
          }}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm h-8"
          maxLength={MAX_COMMENT_LENGTH}
        />
        <Button
          onClick={() => addCommentMutation.mutate()}
          disabled={!newComment.trim() || addCommentMutation.isPending}
          size="sm"
          variant="ghost"
          className="text-white/60 hover:text-emerald-400 hover:bg-white/5 h-8 px-2"
        >
          {addCommentMutation.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Send size={14} />
          )}
        </Button>
      </div>
    </div>
  );
};
