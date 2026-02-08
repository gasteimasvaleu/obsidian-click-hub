import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles?: {
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  };
  onDelete: (commentId: string) => void;
  isDeleting: boolean;
}

export const CommentItem = ({ comment, onDelete, isDeleting }: CommentItemProps) => {
  const { user, isAdmin } = useAuth();
  const isOwner = user?.id === comment.user_id;
  const canDelete = isOwner || isAdmin;

  const authorName = comment.profiles?.full_name || "Usuário";
  const avatarUrl = comment.profiles?.avatar_url;
  const initials = authorName.slice(0, 2).toUpperCase();

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div className="flex gap-2 py-2">
      <Avatar className="h-7 w-7 flex-shrink-0">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="bg-white/10 text-white text-[10px]">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-xs font-semibold truncate">
            {authorName}
          </span>
          <span className="text-white/30 text-[10px] flex-shrink-0">{timeAgo}</span>
        </div>
        <p className="text-white/70 text-xs mt-0.5 break-words">{comment.content}</p>
      </div>

      {canDelete && (
        <button
          onClick={() => onDelete(comment.id)}
          disabled={isDeleting}
          className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0 self-start mt-1"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
};
