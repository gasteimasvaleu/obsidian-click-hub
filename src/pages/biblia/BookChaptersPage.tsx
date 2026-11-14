import { BackArrowButton } from "@/components/plataforma/BackArrowButton";
import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import { BubbleSection, SPLIT_BAR } from "@/components/ui/bubble-section";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";

export default function BookChaptersPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(1);

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

  const total = chapters?.length ?? 0;
  const current = Math.min(Math.max(1, selected), Math.max(1, total));

  return (
    <div className="min-h-screen bg-background pb-24">
      <FuturisticNavbar />
      
      <div className="container mx-auto px-4 pt-20 max-w-[58rem]">
        <BackArrowButton to={"/biblia"} label="Voltar" className="mb-4" />
        <SectionHeader title={book?.name} description={book?.chapters_count ? `${book.chapters_count} capítulos` : undefined} className="mb-6" />

        {total > 0 && (
          <BubbleSection title="Escolha o capítulo">
            <div className="text-center mb-5">
              <p className="text-sm text-muted-foreground">Capítulo</p>
              <p className="text-6xl font-black text-primary leading-none my-1">{current}</p>
              <p className="text-sm text-muted-foreground">de {total}</p>
            </div>
            {total > 1 && (
              <>
                <Slider
                  min={1}
                  max={total}
                  step={1}
                  value={[current]}
                  onValueChange={(v) => setSelected(v[0])}
                  aria-label="Capítulo"
                  className="mb-5"
                />
                <div className={`${SPLIT_BAR} h-11 mb-4`}>
                  <button type="button" aria-label="Capítulo anterior" disabled={current <= 1}
                    onClick={() => setSelected(Math.max(1, current - 1))}
                    className="flex-1 flex items-center justify-center text-primary disabled:opacity-40">
                    <Minus className="h-5 w-5" />
                  </button>
                  <button type="button" aria-label="Próximo capítulo" disabled={current >= total}
                    onClick={() => setSelected(Math.min(total, current + 1))}
                    className="flex-1 flex items-center justify-center text-primary disabled:opacity-40">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
            <ArrowNavButton direction="right" label="Ler capítulo"
              onClick={() => navigate(`/biblia/${bookId}/${current}`)} />
          </BubbleSection>
        )}
      </div>
    </div>
  );
}
