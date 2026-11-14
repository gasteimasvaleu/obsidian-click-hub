import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FuturisticNavbar } from '@/components/FuturisticNavbar';
import { GlassCard } from '@/components/GlassCard';
import { DrawingCard } from '@/components/colorir/DrawingCard';
import { CategoryFilter } from '@/components/colorir/CategoryFilter';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Palette, Camera, FolderHeart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import fotoImg from '@/assets/colorir/transformar-foto.png.asset.json';
import criacoesImg from '@/assets/colorir/minhas-criacoes.png.asset.json';

interface Drawing {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  difficulty: string;
}

const ColorirPage = () => {
  const navigate = useNavigate();
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    const { data, error } = await supabase
      .from('coloring_drawings')
      .select('*')
      .eq('available', true)
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar desenhos');
      console.error(error);
    } else {
      setDrawings(data || []);
    }
    setLoading(false);
  };

  const filteredDrawings = selectedCategory === 'all'
    ? drawings
    : drawings.filter((d) => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background pb-32">
      <FuturisticNavbar />

      <main className="container mx-auto px-4 pt-16 max-w-[58rem]">
        {/* Hero */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <GlassCard className="w-full max-w-4xl p-0 overflow-hidden">
            <video
              src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/colorir%20novo.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="aspect-video w-full h-auto object-cover rounded-2xl"
            />
          </GlassCard>
        </div>

        {/* Description Card */}
        <div className="w-full max-w-4xl mx-auto">
            <SectionHeader title="Colorir Bíblico" description="Pinte desenhos bíblicos incríveis e solte sua criatividade!" className="mb-6" />
          </div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto mb-8 animate-fade-in">
          <GlassCard
            hoverable
            pressable
            onClick={() => navigate('/colorir/transformar')}
            className="flex flex-col items-center justify-center p-6 cursor-pointer min-h-[120px]"
          >
            <img src={fotoImg.url} alt="" loading="lazy" className="mb-3 h-16 w-16 object-contain" />
            <span className="text-foreground text-center font-semibold text-sm">Transformar Foto</span>
          </GlassCard>
          <GlassCard
            hoverable
            pressable
            onClick={() => navigate('/colorir/minhas-criacoes')}
            className="flex flex-col items-center justify-center p-6 cursor-pointer min-h-[120px]"
          >
            <img src={criacoesImg.url} alt="" loading="lazy" className="mb-3 h-16 w-16 object-contain" />
            <span className="text-foreground text-center font-semibold text-sm">Minhas Criações</span>
          </GlassCard>
        </div>

        {/* Category Filter */}
        <div className="max-w-4xl mx-auto mb-6 animate-fade-in">
          <SectionHeader
            title="Categoria"
            description={loading ? 'Carregando...' : `${filteredDrawings.length} ${filteredDrawings.length === 1 ? 'desenho disponível' : 'desenhos disponíveis'}`}
          />
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
        </div>

        {/* Drawings Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <GlassCard key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-3" />
                <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                <div className="h-8 bg-muted rounded" />
              </GlassCard>
            ))
          ) : filteredDrawings.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={<Palette size={40} strokeWidth={1.5} />}
                title="Nenhum desenho disponível"
                description="Novos desenhos bíblicos estão chegando em breve!"
              />
            </div>
          ) : (
            filteredDrawings.map((drawing) => (
              <DrawingCard
                key={drawing.id}
                id={drawing.id}
                title={drawing.title}
                description={drawing.description || undefined}
                imageUrl={drawing.image_url}
                category={drawing.category}
                difficulty={drawing.difficulty}
                onSelect={(id) => navigate(`/colorir/editor/${id}`)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ColorirPage;
