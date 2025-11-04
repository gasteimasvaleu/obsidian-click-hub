import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from 'virtual:pwa-register';

// Registra o Service Worker e escuta por atualizações
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('🔄 Nova versão disponível! Atualizando automaticamente...');
  },
  onOfflineReady() {
    console.log('✅ App pronto para funcionar offline!');
  },
  onRegistered(registration) {
    console.log('✅ Service Worker registrado com sucesso!');
    
    // Verifica por atualizações a cada 1 hora
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
    }
  },
  onRegisterError(error) {
    console.error('❌ Erro ao registrar Service Worker:', error);
  },
  immediate: true
});

createRoot(document.getElementById("root")!).render(<App />);
