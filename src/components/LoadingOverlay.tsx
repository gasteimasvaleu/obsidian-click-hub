import loadingVideo from '@/assets/loading/jesus-crianca.mp4.asset.json';
import { useEffect, useRef, useState } from 'react';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay = ({ visible, message }: LoadingOverlayProps) => {
  const [show, setShow] = useState(false);
  const [render, setRender] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (visible) {
      setRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setShow(true));
      });
    } else {
      setShow(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    if (!render) return;
    const v = videoRef.current;
    if (!v) return;
    // iOS WKWebView pode ignorar atributos do React no 1º render — forçamos imperativamente.
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    try { v.load(); } catch {}
    v.play().catch(() => {});
  }, [render]);

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-card flex flex-col items-center justify-center transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={loadingVideo.url}
        className="h-72 w-auto object-contain"
        autoPlay
        muted
        playsInline
        // @ts-ignore - iOS WKWebView legacy attribute
        webkit-playsinline=""
        loop
      />

      {/* Progress bar */}
      <div className="mt-6 w-[60%] max-w-[300px] h-1 rounded-full bg-primary/15 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-primary/60 loading-bar-indeterminate" />
      </div>

      {/* Message */}
      {message && (
        <p className="mt-4 text-sm text-muted-foreground text-center px-4">{message}</p>
      )}
    </div>
  );
};
