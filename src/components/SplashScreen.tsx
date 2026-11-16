import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import splashImage from "@/assets/splash/abertura-frame-inicial.png.asset.json";
import splashVideo from "@/assets/splash/abertura-bibliatoon.mp4.asset.json";

interface SplashScreenProps {
  onComplete: () => void;
}

const SPLASH_IMAGE_URL = splashImage.url;
const SPLASH_VIDEO_URL = splashVideo.url;
const SPLASH_DURATION_MS = 6000;

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const completedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const triggerExit = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setFadeOut(true);
    setTimeout(() => onComplete(), 400);
  };

  useEffect(() => {
    // Absolute max timeout — always exits no matter what
    const maxTimer = setTimeout(() => {
      triggerExit();
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(maxTimer);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const primeAndPlay = () => {
      // iOS WKWebView (iOS 17/18) ignora atributos React no 1º render.
      // Forçamos os atributos imperativamente antes do play().
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      if (!v.paused && !v.ended) return;
      if (v.ended) return;
      v.play().catch(() => {});
    };
    const tryPlay = () => primeAndPlay();
    tryPlay();
    const onVis = () => { if (document.visibilityState === 'visible') tryPlay(); };
    v.addEventListener('loadeddata', tryPlay);
    v.addEventListener('canplay', tryPlay);
    document.addEventListener('visibilitychange', onVis);
    document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
    return () => {
      v.removeEventListener('loadeddata', tryPlay);
      v.removeEventListener('canplay', tryPlay);
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('touchstart', tryPlay);
    };
  }, []);

  const handleVideoLoad = () => {
    console.log("SplashScreen: video loaded");
    setVideoReady(true);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] bg-card flex items-center justify-center overflow-hidden transition-opacity duration-400",
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      {/* Always show branding image as base layer */}
      <img
        src={SPLASH_IMAGE_URL}
        alt="BíbliaToon Club"
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
          videoReady ? "opacity-0" : "opacity-100"
        )}
      />

      {/* Video as enhancement layer — not a dependency */}
      <video
        ref={videoRef}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          videoReady ? "opacity-100" : "opacity-0"
        )}
        autoPlay
        muted
        playsInline
        // @ts-ignore - iOS WKWebView legacy attribute
        webkit-playsinline=""
        preload="auto"
        onLoadedData={handleVideoLoad}
        onError={() => {
          console.warn("SplashScreen: video failed to load, using image fallback");
        }}
      >
        <source src={SPLASH_VIDEO_URL} type="video/mp4" />
      </video>
    </div>
  );
};
