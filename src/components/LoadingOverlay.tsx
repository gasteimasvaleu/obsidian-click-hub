import loadingVideo from '@/assets/loading/jesus-crianca-centro.mp4.asset.json';
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
      className={`fixed inset-0 z-[9999] overflow-hidden bg-[#FBFBFC] transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <video
        ref={videoRef}
        src={loadingVideo.url}
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay
        muted
        playsInline
        // @ts-ignore - iOS WKWebView legacy attribute
        webkit-playsinline=""
        loop
      />

      <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+3rem)] flex flex-col items-center px-4">
        <div className="w-[60%] max-w-[300px] h-1 rounded-full bg-primary/15 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-primary/60 loading-bar-indeterminate" />
        </div>
        {message && (
          <p className="mt-4 text-sm text-muted-foreground text-center">{message}</p>
        )}
      </div>
    </div>
  );
};
