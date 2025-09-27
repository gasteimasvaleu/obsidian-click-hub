import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    console.log("SplashScreen mounted");
    
    // Fallback timer in case video doesn't load or end event fails
    const fallbackTimer = setTimeout(() => {
      console.log("Fallback timer triggered");
      handleComplete();
    }, 6000); // 6 seconds fallback

    return () => clearTimeout(fallbackTimer);
  }, []);

  const handleComplete = () => {
    console.log("handleComplete called");
    setFadeOut(true);
    setTimeout(() => {
      console.log("Calling onComplete");
      onComplete();
    }, 500); // Wait for fade out animation
  };

  const handleVideoEnd = () => {
    console.log("Video ended");
    handleComplete();
  };

  const handleVideoLoad = () => {
    console.log("Video loaded");
    setIsVideoLoaded(true);
  };

  console.log("SplashScreen rendering, fadeOut:", fadeOut, "isVideoLoaded:", isVideoLoaded);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-500",
        fadeOut ? "opacity-0" : "opacity-100"
      )}
      style={{ display: 'block' }}
    >
      {/* Loading indicator while video loads */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Video Element */}
      <video
        className={cn(
          "transition-opacity duration-300",
          "w-full h-full object-cover",
          // Mobile: full screen cover
          "md:w-auto md:h-full md:max-w-none",
          // Desktop: maintain 9:16 aspect ratio, centered
          "md:object-contain",
          isVideoLoaded ? "opacity-100" : "opacity-0"
        )}
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoad}
        onEnded={handleVideoEnd}
        onError={() => {
          console.error("Video failed to load, completing splash screen");
          handleComplete();
        }}
      >
        <source
          src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/splash2.mp4"
          type="video/mp4"
        />
        {/* Fallback for browsers that don't support video */}
        <div className="flex items-center justify-center h-full">
          <img
            src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/image.png"
            alt="BíbliaToonKIDS"
            className="max-w-sm max-h-96 object-contain"
            onLoad={handleComplete}
          />
        </div>
      </video>

      {/* Optional skip button */}
      <button
        onClick={handleComplete}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 z-10"
      >
        Pular
      </button>
    </div>
  );
};