import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  onComplete: () => void;
}

const SPLASH_IMAGE_URL = "https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/image.png";
const SPLASH_VIDEO_URL = "https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/novosplash.mp4";
const MIN_DISPLAY_MS = 2000;
const MAX_DISPLAY_MS = 6000;

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const completedRef = useRef(false);
  const mountTimeRef = useRef(Date.now());

  const triggerExit = () => {
    if (completedRef.current) return;
    const elapsed = Date.now() - mountTimeRef.current;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      setFadeOut(true);
      setTimeout(() => onComplete(), 400);
    }, remaining);
  };

  useEffect(() => {
    // Absolute max timeout — always exits no matter what
    const maxTimer = setTimeout(() => {
      console.log("SplashScreen: max timeout reached, forcing exit");
      triggerExit();
    }, MAX_DISPLAY_MS);

    return () => clearTimeout(maxTimer);
  }, []);

  const handleVideoEnd = () => {
    console.log("SplashScreen: video ended");
    triggerExit();
  };

  const handleVideoLoad = () => {
    console.log("SplashScreen: video loaded");
    setVideoReady(true);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-400",
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      {/* Always show branding image as base layer */}
      <img
        src={SPLASH_IMAGE_URL}
        alt="BíbliaToon Club"
        className={cn(
          "absolute inset-0 w-full h-full object-contain transition-opacity duration-300",
          videoReady ? "opacity-0" : "opacity-100"
        )}
      />

      {/* Video as enhancement layer — not a dependency */}
      <video
        className={cn(
          "w-full h-full object-contain transition-opacity duration-300",
          videoReady ? "opacity-100" : "opacity-0"
        )}
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoad}
        onEnded={handleVideoEnd}
        onError={() => {
          console.warn("SplashScreen: video failed to load, using image fallback");
        }}
      >
        <source src={SPLASH_VIDEO_URL} type="video/mp4" />
      </video>
    </div>
  );
};
