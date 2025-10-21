import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    console.log("SplashScreen mounted, showSplash:", showSplash);
    
    // Minimum time before allowing any transition
    const minTimer = setTimeout(() => {
      console.log("Minimum time elapsed (2s)");
      setMinTimeElapsed(true);
    }, 2000);
    
    // Fallback timer in case video doesn't load or end event fails
    const fallbackTimer = setTimeout(() => {
      console.log("Fallback timer triggered (8s)");
      handleComplete();
    }, 8000);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleComplete = () => {
    console.log("handleComplete called, minTimeElapsed:", minTimeElapsed);
    if (!minTimeElapsed) {
      console.log("Minimum time not elapsed, ignoring complete request");
      return;
    }
    
    console.log("Starting fade out");
    setFadeOut(true);
    setTimeout(() => {
      console.log("Calling onComplete");
      onComplete();
    }, 500);
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
          console.error("Video failed to load, will use fallback timer");
          setIsVideoLoaded(true); // Show the fallback content
        }}
      >
        <source
          src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/novosplash.mp4"
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

    </div>
  );
};