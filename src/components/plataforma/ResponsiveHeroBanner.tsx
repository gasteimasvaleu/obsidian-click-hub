import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ResponsiveHeroBannerProps {
  bannerDesktop?: string;
  bannerMobile?: string;
  videoDesktop?: string;
  videoMobile?: string;
  useVideo?: boolean;
  title?: string;
  description?: string;
  aspectRatioDesktop?: number;
  aspectRatioMobile?: number;
  overlay?: boolean;
  bottomGradient?: boolean;
}

export function ResponsiveHeroBanner({
  bannerDesktop,
  bannerMobile,
  videoDesktop,
  videoMobile,
  useVideo = false,
  title,
  description,
  aspectRatioDesktop = 16 / 9,
  aspectRatioMobile = 9 / 16,
  overlay = true,
  bottomGradient = false,
}: ResponsiveHeroBannerProps) {
  const isMobile = useIsMobile();

  const banner = isMobile ? bannerMobile : bannerDesktop;
  const video = isMobile ? videoMobile : videoDesktop;
  const aspectRatio = isMobile ? aspectRatioMobile : aspectRatioDesktop;

  const showVideo = useVideo && video;
  const showImage = !showVideo && banner;

  if (!showVideo && !showImage) {
    return (
      <div className="w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center py-20">
        {(title || description) && (
          <div className="text-center px-4">
            {title && (
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <AspectRatio ratio={aspectRatio}>
        {showVideo ? (
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            onError={(e) => console.error("Banner video error:", e)}
            onStalled={() => console.warn("Banner video stalled")}
          />
        ) : (
          <img
            src={banner}
            alt={title || "Banner"}
            className="w-full h-full object-cover"
          />
        )}

        {bottomGradient && (
          <div className="absolute inset-x-0 bottom-0 h-32 md:h-48 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
        )}

        {overlay && (title || description) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
            {title && (
              <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-sm md:text-xl text-white/90 max-w-2xl drop-shadow-md">
                {description}
              </p>
            )}
          </div>
        )}
      </AspectRatio>
    </div>
  );
}
