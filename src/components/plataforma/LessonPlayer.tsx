import { useState, useRef, useCallback } from "react";
import { ExternalLink, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LessonPlaylist } from "./LessonPlaylist";
import { MaterialsList } from "./MaterialsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ParentalGate } from "@/components/ParentalGate";

interface LessonMaterial {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size?: number;
}

interface RelatedLesson {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration?: number;
  linkTo: string;
}

interface LessonPlayerProps {
  videoUrl?: string;
  videoSource?: "upload" | "external";
  title: string;
  description: string;
  externalContentUrl?: string;
  materials: LessonMaterial[];
  relatedLessons: RelatedLesson[];
  currentLessonId: string;
}

export function LessonPlayer({
  videoUrl,
  videoSource = "upload",
  title,
  description,
  externalContentUrl,
  materials,
  relatedLessons,
  currentLessonId,
}: LessonPlayerProps) {
  const isMobile = useIsMobile();
  const [showRelated, setShowRelated] = useState(!isMobile);
  const [videoError, setVideoError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [stallCount, setStallCount] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  const [hasRetried, setHasRetried] = useState(false);
  const [showParentalGate, setShowParentalGate] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isExternalContentOnly = externalContentUrl && !videoUrl;

  // Save position continuously for recovery
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setLastPosition(videoRef.current.currentTime);
    }
  }, []);

  // Handle video stall with recovery attempt
  const handleStalled = useCallback(() => {
    console.warn("Video stalled - attempting recovery");
    setStallCount(prev => {
      const newCount = prev + 1;
      // After 3 consecutive stalls, show buffering indicator
      if (newCount >= 3) {
        setIsBuffering(true);
      }
      return newCount;
    });
  }, []);

  // Handle video playing - reset error states
  const handlePlaying = useCallback(() => {
    setIsBuffering(false);
    setVideoError(false);
    setStallCount(0);
    setHasRetried(false);
  }, []);

  // Handle video error with automatic retry
  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error("Video error:", e);
    
    // Try to recover automatically once
    if (!hasRetried && videoRef.current && lastPosition > 0) {
      console.log("Attempting video recovery from position:", lastPosition);
      setHasRetried(true);
      const video = videoRef.current;
      video.load();
      video.currentTime = lastPosition;
      video.play().catch(() => {
        console.error("Recovery failed, showing error state");
        setVideoError(true);
      });
    } else {
      setVideoError(true);
    }
  }, [hasRetried, lastPosition]);

  // Reset stall count when video can play through
  const handleCanPlayThrough = useCallback(() => {
    setStallCount(0);
  }, []);

  const openExternalContent = () => {
    if (externalContentUrl) {
      setShowParentalGate(true);
    }
  };

  const handleParentalGateSuccess = () => {
    if (externalContentUrl) {
      window.open(externalContentUrl, "_blank", "noopener,noreferrer");
    }
  };

  const isYouTube = videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");
  const isVimeo = videoUrl?.includes("vimeo.com");

  const getEmbedUrl = (url: string) => {
    if (isYouTube) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (isVimeo) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
  };

  const renderVideo = () => {
    if (!videoUrl) {
      return (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">Vídeo não disponível</span>
        </div>
      );
    }

    if (videoSource === "external" || isYouTube || isVimeo) {
      return (
        <iframe
          src={getEmbedUrl(videoUrl)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      );
    }

    return (
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          controlsList="nodownload"
          playsInline
          className="w-full h-full object-contain bg-black"
          preload="metadata"
          onError={handleVideoError}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={handlePlaying}
          onStalled={handleStalled}
          onTimeUpdate={handleTimeUpdate}
          onCanPlayThrough={handleCanPlayThrough}
        >
          Seu navegador não suporta o elemento de vídeo.
        </video>
        
        {/* Buffering indicator */}
        {isBuffering && !videoError && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Error state */}
        {videoError && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4">
            <p className="text-white text-center px-4">Erro ao carregar o vídeo</p>
            <Button 
              onClick={() => {
                setVideoError(false);
                window.location.reload();
              }}
              variant="default"
            >
              Tentar novamente
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col lg:flex-row gap-6", isMobile && "gap-4")}>
      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Video player or external content button */}
        <div className="bg-black rounded-lg overflow-hidden">
          <AspectRatio ratio={16 / 9}>
            {isExternalContentOnly ? (
              <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-4">
                <ExternalLink className="h-12 w-12 text-muted-foreground" />
                <Button
                  variant="default"
                  size="lg"
                  onClick={openExternalContent}
                  className="gap-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  Abrir conteúdo externo
                </Button>
              </div>
            ) : (
              renderVideo()
            )}
          </AspectRatio>
        </div>

        {/* Title and description */}
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {description}
          </p>
        </div>

        {/* External content button - only show if has both video AND external content */}
        {externalContentUrl && videoUrl && (
          <Button
            variant="outline"
            onClick={openExternalContent}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir conteúdo externo
          </Button>
        )}

        {/* Materials */}
        {materials.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Materiais complementares
            </h2>
            <MaterialsList materials={materials} />
          </div>
        )}

        {/* Mobile: Related lessons */}
        {isMobile && relatedLessons.length > 0 && (
          <div className="border-t pt-4">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setShowRelated(!showRelated)}
            >
              <span className="font-semibold">Próximas aulas ({relatedLessons.length})</span>
              {showRelated ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
            {showRelated && (
              <LessonPlaylist
                items={relatedLessons}
                layout="vertical"
                currentLessonId={currentLessonId}
                className="mt-2"
              />
            )}
          </div>
        )}
      </div>

      {/* Desktop: Sidebar with related lessons */}
      {!isMobile && relatedLessons.length > 0 && (
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-4 bg-card rounded-lg p-4 border">
            <h2 className="font-semibold mb-3">Próximas aulas</h2>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <LessonPlaylist
                items={relatedLessons}
                layout="vertical"
                currentLessonId={currentLessonId}
              />
            </div>
          </div>
        </div>
      )}

      <ParentalGate
        open={showParentalGate}
        onOpenChange={setShowParentalGate}
        onSuccess={handleParentalGateSuccess}
      />
    </div>
  );
}
