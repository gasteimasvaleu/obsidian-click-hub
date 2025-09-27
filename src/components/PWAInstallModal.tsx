import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor, Share, Plus, Download } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isInstallable: boolean;
}

export const PWAInstallModal = ({ isOpen, onClose, onInstall, isInstallable }: PWAInstallModalProps) => {
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop'>('desktop');

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) {
      setPlatform('android');
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      setPlatform('ios');
    } else {
      setPlatform('desktop');
    }
  }, []);

  const getInstructions = () => {
    switch (platform) {
      case 'android':
        return {
          title: 'Instalar no Android',
          steps: [
            'Toque no menu (⋮) do navegador',
            'Selecione "Adicionar à tela inicial"',
            'Confirme a instalação'
          ],
          icon: <Smartphone className="w-6 h-6" />
        };
      case 'ios':
        return {
          title: 'Instalar no iPhone/iPad',
          steps: [
            'Toque no botão de compartilhar',
            'Role para baixo e toque em "Adicionar à Tela de Início"',
            'Toque em "Adicionar" para confirmar'
          ],
          icon: <Share className="w-6 h-6" />
        };
      default:
        return {
          title: 'Instalar no Computador',
          steps: [
            'Clique no ícone de instalação na barra de endereço',
            'Ou use o menu do navegador',
            'Selecione "Instalar BíbliaToonKIDS"'
          ],
          icon: <Monitor className="w-6 h-6" />
        };
    }
  };

  const instructions = getInstructions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass max-w-[calc(100vw-2rem)] sm:max-w-xl border-white/10 shadow-[0_0_40px_rgba(0,255,0,0.3)]">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img 
                src="/pwa-192x192.png" 
                alt="BíbliaToonKIDS" 
                className="w-16 h-16 rounded-2xl"
              />
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                <Plus className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            Instalar BíbliaToonKIDS
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Adicione o app à sua tela inicial para acesso rápido e experiência completa!
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4 text-primary">
            {instructions.icon}
            <h3 className="font-semibold text-white">{instructions.title}</h3>
          </div>
          
          <ol className="space-y-2 text-sm text-gray-300">
            {instructions.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary/20 text-primary rounded-full text-xs flex items-center justify-center font-semibold">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex gap-3 mt-6">
          {isInstallable && (
            <Button 
              onClick={onInstall}
              className="flex-1 bg-primary hover:bg-primary/90 text-black font-semibold neon-glow"
            >
              <Download className="w-4 h-4 mr-2" />
              Instalar Agora
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            Talvez Depois
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};