import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');
    
    setIsInstalled(isStandalone);
    
    // Check if user has already seen the modal
    const seenModal = localStorage.getItem('pwa-modal-seen');
    const seenDate = localStorage.getItem('pwa-modal-seen-date');
    const daysSinceLastSeen = seenDate ? Math.floor((Date.now() - parseInt(seenDate)) / (1000 * 60 * 60 * 24)) : 0;
    
    // Show modal if never seen or if 7 days have passed
    setHasSeenModal(!!seenModal && daysSinceLastSeen < 7);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const markModalAsSeen = () => {
    localStorage.setItem('pwa-modal-seen', 'true');
    localStorage.setItem('pwa-modal-seen-date', Date.now().toString());
    setHasSeenModal(true);
  };

  const shouldShowModal = !isInstalled && !hasSeenModal;

  return {
    isInstallable,
    isInstalled,
    shouldShowModal,
    installPWA,
    markModalAsSeen
  };
};