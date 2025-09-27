import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";

interface RedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
  title: string;
}

export const RedirectModal = ({ isOpen, onClose, targetUrl, title }: RedirectModalProps) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenPopup = () => {
    console.log('Opening login popup for:', targetUrl);
    setIsOpening(true);
    
    try {
      // Save app state in localStorage for when user returns
      localStorage.setItem('returnUrl', window.location.pathname);
      localStorage.setItem('appState', JSON.stringify({ timestamp: Date.now() }));
      
      // Calculate center position for popup
      const width = 500;
      const height = 700;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      console.log('Opening centered popup window...');
      
      // Open popup window
      window.open(
        targetUrl,
        'loginWindow',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes,location=yes`
      );
      
      // Close modal after opening popup
      setTimeout(() => {
        setIsOpening(false);
        onClose();
      }, 500);
      
    } catch (error) {
      console.error('Failed to open popup:', error);
      setIsOpening(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border border-primary/20 backdrop-blur-lg max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-primary text-xl font-semibold mb-2">
            Janela de Login
          </DialogTitle>
          <DialogDescription className="text-white/80 text-base leading-relaxed">
            Uma janela popup será aberta para o login no <strong>{title}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Instructions */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-white/90 text-sm flex items-center gap-2">
              <ArrowLeft size={16} className="text-primary" />
              <strong>Para voltar:</strong> Feche a janela popup e retorne a este app
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
              disabled={isOpening}
            >
              Cancelar
            </Button>
            
            <Button
              onClick={handleOpenPopup}
              disabled={isOpening}
              className="bg-primary text-black hover:bg-primary/90 font-semibold"
            >
              {isOpening ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Abrindo...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ExternalLink size={16} />
                  Abrir Janela
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};