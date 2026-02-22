import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";

export default function BookChaptersPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const { data: book } = useQuery({
    queryKey: ['bible-book', bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bible_books')
        .select('*')
        .eq('id', bookId)
        .single();
      if (error) throw error;
      return data;
    }
  });

  const { data: chapters } = useQuery({
    queryKey: ['bible-chapters', bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bible_chapters')
        .select('*')
        .eq('book_id', bookId)
        .order('chapter_number');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <FuturisticNavbar />
      
      <div className="container mx-auto px-4 pt-20">
        <GlassCard className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent mb-3">{book?.name}</h1>
          
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">{book?.chapters_count} capítulos</p>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/biblia')}
              size="sm"
            >
              <ChevronLeft size={16} /> Voltar
            </Button>
          </div>
        </GlassCard>

        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {chapters?.map(chapter => (
            <GlassCard
              key={chapter.id}
              hoverable
              pressable
              onClick={() => navigate(`/biblia/${bookId}/${chapter.chapter_number}`)}
              className="p-4 cursor-pointer flex items-center justify-center"
            >
              <span className="text-2xl font-bold text-foreground">
                {chapter.chapter_number}
              </span>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
