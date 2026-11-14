import { ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FuturisticNavbar } from '@/components/FuturisticNavbar';
import { GlassCard } from '@/components/GlassCard';
import { CreationCard } from '@/components/colorir/CreationCard';
import { ShareModal } from '@/components/colorir/ShareModal';
import { EmptyState } from '@/components/EmptyState';
import criacoesImg from '@/assets/colorir/minhas-criacoes.png.asset.json';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FolderHeart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Creation {
  id: string;
  title: string;
  colored_image_url: string;
  is_from_photo: boolean;
  created_at: string;
}

const MyCreationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModal, setShareModal] = useState<{ open: boolean; imageUrl: string; title: string }>({
    open: false,
    imageUrl: '',
    title: '',
  });

  useEffect(() => {
    if (user) loadCreations();
  }, [user]);

  const loadCreations = async () => {
    const { data, error } = await supabase
      .from('user_coloring_creations')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar criações');
      console.error(error);
    } else {
      setCreations(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('user_coloring_creations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir');
    } else {
      setCreations((prev) => prev.filter((c) => c.id !== id));
      toast.success('Criação excluída');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <FuturisticNavbar />

      <main className="container mx-auto px-4 pt-16 max-w-3xl">
        <ArrowNavButton direction="left" label="Voltar" onClick={() => navigate('/colorir')} className="mb-4" />

        <GlassCard className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/20 animate-float">
            <img
              src={criacoesImg.url}
              alt="Pasta de desenhos coloridos"
              className="h-full w-full object-contain p-2"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">Minhas Criações</h1>
          <p className="text-muted-foreground text-sm">
            {loading ? 'Carregando...' : `${creations.length} criação(ões)`}
          </p>
        </GlassCard>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : creations.length === 0 ? (
          <EmptyState
            icon={<FolderHeart size={40} strokeWidth={1.5} />}
            title="Nenhuma criação ainda"
            description="Comece a colorir desenhos bíblicos e eles aparecerão aqui!"
            action={{
              label: 'Começar a Colorir',
              onClick: () => navigate('/colorir'),
            }}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {creations.map((creation) => (
              <CreationCard
                key={creation.id}
                id={creation.id}
                title={creation.title}
                coloredImageUrl={creation.colored_image_url}
                isFromPhoto={creation.is_from_photo}
                createdAt={creation.created_at}
                onShare={(imageUrl, title) =>
                  setShareModal({ open: true, imageUrl, title })
                }
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <ShareModal
        open={shareModal.open}
        onClose={() => setShareModal((s) => ({ ...s, open: false }))}
        imageUrl={shareModal.imageUrl}
        title={shareModal.title}
      />
    </div>
  );
};

export default MyCreationsPage;
