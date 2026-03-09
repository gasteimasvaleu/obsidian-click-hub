import { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay = ({ visible, message }: LoadingOverlayProps) => {
  const [show, setShow] = useState(false);
  const [render, setRender] = useState(false);

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

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Video */}
      <video
        src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/loading2.mp4"
        className="w-48 h-48 object-contain"
        autoPlay
        muted
        playsInline
        loop
      />

      {/* Progress bar */}
      <div className="mt-6 w-[60%] max-w-[300px] h-1 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-primary/60 loading-bar-indeterminate" />
      </div>

      {/* Message */}
      {message && (
        <p className="mt-4 text-sm text-white/70 text-center px-4">{message}</p>
      )}
    </div>
  );
};
