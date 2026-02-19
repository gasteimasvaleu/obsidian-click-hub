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
    <div className="min-h-screen bg-background pb-24">
      <FuturisticNavbar />

      <main className="container mx-auto px-4 pt-16">
        {/* Hero */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <GlassCard className="w-full max-w-3xl p-0 overflow-hidden">
            <video
              src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/colorir%20novo.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-auto rounded-2xl"
            />
          </GlassCard>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto mb-8 animate-fade-in">
          <GlassCard
            hoverable
            pressable
            onClick={() => navigate('/colorir/transformar')}
            className="flex flex-col items-center justify-center p-6 cursor-pointer min-h-[120px]"
          >
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-3">
              <Camera size={24} className="text-white" />
            </div>
            <span className="text-foreground text-center font-semibold text-sm">Transformar Foto</span>
          </GlassCard>
          <GlassCard
            hoverable
            pressable
            onClick={() => navigate('/colorir/minhas-criacoes')}
            className="flex flex-col items-center justify-center p-6 cursor-pointer min-h-[120px]"
          >
            <div className="p-3 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 mb-3">
              <FolderHeart size={24} className="text-white" />
            </div>
            <span className="text-foreground text-center font-semibold text-sm">Minhas Criações</span>
          </GlassCard>
        </div>

        {/* Category Filter */}
        <GlassCard className="max-w-3xl mx-auto mb-6 animate-fade-in">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Categoria</h3>
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
          <p className="text-xs text-muted-foreground mt-3">
            {loading ? 'Carregando...' : `${filteredDrawings.length} desenho(s) disponível(is)`}
          </p>
        </GlassCard>

        {/* Drawings Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
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
                description="Novos desenhos bíblicos estão chegando em breve! 🎨"
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
