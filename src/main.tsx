import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from 'virtual:pwa-register';

// Detecta preview do Lovable / iframe — não registrar SW nesses contextos
const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
})();

const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com") ||
  window.location.hostname.includes("lovable.app");

if (isPreviewHost || isInIframe) {
  // Desregistra qualquer SW pré-existente no preview para evitar cache obsoleto
  navigator.serviceWorker?.getRegistrations().then((registrations) => {
    registrations.forEach((r) => r.unregister());
  });
} else {
  // Registra o Service Worker apenas em produção (app nativo / site publicado)
  const updateSW = registerSW({
  onNeedRefresh() {
    console.log('🔄 Nova versão disponível! Atualizando automaticamente...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('✅ App pronto para funcionar offline!');
  },
  onRegistered(registration) {
    console.log('✅ Service Worker registrado com sucesso!');
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
}

createRoot(document.getElementById("root")!).render(<App />);
