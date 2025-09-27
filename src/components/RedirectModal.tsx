import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft } from "lucide-react";

interface RedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
  title: string;
}

export const RedirectModal = ({ isOpen, onClose, targetUrl, title }: RedirectModalProps) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleRedirect = () => {
    setIsRedirecting(true);
    
    // Save app state in localStorage for when user returns
    localStorage.setItem('returnUrl', window.location.pathname);
    localStorage.setItem('appState', JSON.stringify({ timestamp: Date.now() }));
    
    // Small delay to show loading state
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border border-primary/20 backdrop-blur-lg max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-primary text-xl font-semibold mb-2">
            Redirecionamento para Login
          </DialogTitle>
          <DialogDescription className="text-white/80 text-base leading-relaxed">
            Você será redirecionado para a página de login externa do <strong>{title}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-white/90 text-sm flex items-center gap-2">
              <ArrowLeft size={16} className="text-primary" />
              <strong>Para voltar ao app:</strong> Use o botão "Voltar" do seu navegador
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
              disabled={isRedirecting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRedirect}
              disabled={isRedirecting}
              className="bg-primary text-black hover:bg-primary/90 font-semibold"
            >
              {isRedirecting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Redirecionando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ExternalLink size={16} />
                  Continuar
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};