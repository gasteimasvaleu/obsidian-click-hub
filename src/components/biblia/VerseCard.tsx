import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Star, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface VerseCardProps {
  verse: {
    id: string;
    verse_number: number;
    text: string;
  };
  bookName: string;
  chapterNumber: number;
  isFavorite: boolean;
}

export default function VerseCard({ verse, bookName, chapterNumber, isFavorite }: VerseCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [note, setNote] = useState("");

  const reference = `${bookName} ${chapterNumber}:${verse.verse_number}`;

  const handleCopy = () => {
    const textToCopy = `"${verse.text}" - ${reference}`;
    navigator.clipboard.writeText(textToCopy);
    toast.success("Versículo copiado!");
  };

  const handleShare = async () => {
    const shareText = `"${verse.text}" - ${reference}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch (error) {
        console.log('Compartilhamento cancelado');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Link copiado para compartilhar!");
    }
  };

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Usuário não autenticado');

      if (isFavorite) {
        await supabase
          .from('user_favorite_verses')
          .delete()
          .eq('user_id', user.id)
          .eq('verse_id', verse.id);
      } else {
        await supabase
          .from('user_favorite_verses')
          .insert({ user_id: user.id, verse_id: verse.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-verses'] });
      toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
    }
  });

  const addNoteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Usuário não autenticado');
      
      await supabase
        .from('user_verse_notes')
        .insert({
          user_id: user.id,
          verse_id: verse.id,
          note
        });
    },
    onSuccess: () => {
      toast.success('Nota salva com sucesso!');
      setShowNoteDialog(false);
      setNote("");
    }
  });

  return (
    <>
      <GlassCard 
        className={`p-4 ${isFavorite ? 'bg-yellow-500/5 border-yellow-400/30' : ''}`}
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold">{verse.verse_number}</span>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-foreground text-lg mb-3">{verse.text}</p>
            <p className="text-muted-foreground text-sm mb-3">{reference}</p>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={handleCopy} className="w-full sm:w-auto">
                <Copy size={16} className="mr-1" /> Copiar
              </Button>
              
              <Button size="sm" variant="outline" onClick={handleShare} className="w-full sm:w-auto">
                <Share2 size={16} className="mr-1" /> Compartilhar
              </Button>
              
              {user && (
                <>
                  <Button 
                    size="sm" 
                    variant={isFavorite ? "default" : "outline"}
                    onClick={() => toggleFavoriteMutation.mutate()}
                    className="w-full sm:w-auto"
                  >
                    <Star size={16} className="mr-1" /> 
                    {isFavorite ? 'Favoritado' : 'Favoritar'}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowNoteDialog(true)}
                    className="w-full sm:w-auto"
                  >
                    <StickyNote size={16} className="mr-1" /> Nota
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nota</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{reference}</p>
            <Textarea
              placeholder="Escreva sua nota sobre este versículo..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
            />
            <Button 
              onClick={() => addNoteMutation.mutate()}
              disabled={!note.trim()}
            >
              Salvar Nota
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
