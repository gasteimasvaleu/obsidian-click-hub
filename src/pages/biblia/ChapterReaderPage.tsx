import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import VerseCard from "@/components/biblia/VerseCard";
import { GlassCard } from "@/components/GlassCard";

const VERSES_PER_PAGE = 15;

export default function ChapterReaderPage() {
  const { bookId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);

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

  const { data: chapter } = useQuery({
    queryKey: ['bible-chapter', bookId, chapterNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bible_chapters')
        .select('*')
        .eq('book_id', bookId)
        .eq('chapter_number', parseInt(chapterNumber!))
        .single();
      if (error) throw error;
      return data;
    }
  });

  const { data: verses } = useQuery({
    queryKey: ['bible-verses', chapter?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bible_verses')
        .select('*')
        .eq('chapter_id', chapter?.id)
        .order('verse_number');
      if (error) throw error;
      return data;
    },
    enabled: !!chapter?.id
  });

  const { data: favorites } = useQuery({
    queryKey: ['favorite-verses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_favorite_verses')
        .select('verse_id')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map(f => f.verse_id);
    },
    enabled: !!user
  });

  const startIndex = currentPage * VERSES_PER_PAGE;
  const endIndex = startIndex + VERSES_PER_PAGE;
  const paginatedVerses = verses?.slice(startIndex, endIndex) || [];
  const totalPages = Math.ceil((verses?.length || 0) / VERSES_PER_PAGE);

  return (
    <div className="min-h-screen bg-background pb-24">
      <FuturisticNavbar />
      
      <div className="container mx-auto px-4 pt-20">
        <GlassCard className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent mb-3">
            {book?.name} - Capítulo {chapterNumber}
          </h1>
          
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">{verses?.length} versículos</p>
            
            <Button
              variant="ghost"
              onClick={() => navigate(`/biblia/${bookId}`)}
              size="sm"
            >
              <ChevronLeft size={16} /> Voltar
            </Button>
          </div>
        </GlassCard>

        <div className="space-y-4 mb-6">
          {paginatedVerses.map(verse => (
            <VerseCard
              key={verse.id}
              verse={verse}
              bookName={book?.name || ''}
              chapterNumber={parseInt(chapterNumber!)}
              isFavorite={favorites?.includes(verse.id) || false}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-4 items-center">
            <Button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              variant="outline"
            >
              <ChevronLeft size={20} /> Anterior
            </Button>
            
            <span className="text-foreground">
              Página {currentPage + 1} de {totalPages}
            </span>
            
            <Button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              variant="outline"
            >
              Próximo <ChevronRight size={20} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
