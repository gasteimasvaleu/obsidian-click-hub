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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectFailed, setRedirectFailed] = useState(false);

  const handleRedirect = () => {
    console.log('Starting redirect to:', targetUrl);
    setIsRedirecting(true);
    setRedirectFailed(false);
    
    try {
      // Save app state in localStorage for when user returns
      localStorage.setItem('returnUrl', window.location.pathname);
      localStorage.setItem('appState', JSON.stringify({ timestamp: Date.now() }));
      
      console.log('Redirecting to external site...');
      
      // Direct redirect
      window.location.href = targetUrl;
      
      // Fallback: If still on page after 3 seconds, show new tab option
      setTimeout(() => {
        console.log('Redirect may have failed, showing new tab option...');
        setIsRedirecting(false);
        setRedirectFailed(true);
      }, 3000);
      
    } catch (error) {
      console.error('Redirect failed:', error);
      setIsRedirecting(false);
      setRedirectFailed(true);
    }
  };

  const handleOpenInNewTab = () => {
    console.log('Opening in new tab:', targetUrl);
    window.open(targetUrl, '_blank');
    onClose();
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
          {/* Redirect failed message */}
          {redirectFailed && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                Redirecionamento falhou. Tente abrir em nova aba.
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-white/90 text-sm flex items-center gap-2">
              <ArrowLeft size={16} className="text-primary" />
              <strong>Para voltar ao app:</strong> Use o botão "Voltar" do seu navegador
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 justify-center flex-wrap">
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

            {/* Fallback button for failed redirects */}
            {redirectFailed && (
              <Button
                onClick={handleOpenInNewTab}
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/10"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink size={16} />
                  Abrir Nova Aba
                </div>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};