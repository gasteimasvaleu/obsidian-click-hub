import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const ShareModal = ({ open, onClose, imageUrl, title }: ShareModalProps) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Imagem baixada!');
    } catch {
      toast.error('Erro ao baixar imagem');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${title}.png`, { type: 'image/png' });
        await navigator.share({
          title: `${title} - Bíblia Toon Kids`,
          text: 'Olha o desenho que eu colori! 🎨',
          files: [file],
        });
      } else {
        await navigator.clipboard.writeText(imageUrl);
        toast.success('Link copiado!');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        toast.error('Erro ao compartilhar');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Compartilhar Criação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden bg-white">
            <img src={imageUrl} alt={title} className="w-full h-auto" />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download size={16} />
              Baixar
            </Button>
            <Button onClick={handleShare} className="flex-1">
              <Share2 size={16} />
              Compartilhar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
