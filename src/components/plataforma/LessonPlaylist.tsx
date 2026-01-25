import { Link, useParams } from "react-router-dom";
import { Play, Clock, CheckCircle } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface LessonPlaylistItem {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration?: number;
  linkTo: string;
  completed?: boolean;
}

interface LessonPlaylistProps {
  items: LessonPlaylistItem[];
  layout?: "horizontal" | "vertical";
  currentLessonId?: string;
  className?: string;
}

export function LessonPlaylist({
  items,
  layout = "vertical",
  currentLessonId,
  className,
}: LessonPlaylistProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma aula disponível
      </div>
    );
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  if (layout === "horizontal") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
        {items.map((item, index) => (
          <Link
            key={item.id}
            to={item.linkTo}
            className={cn(
              "block rounded-lg overflow-hidden bg-card hover:bg-accent/50 transition-colors group",
              currentLessonId === item.id && "ring-2 ring-primary"
            )}
          >
            <div className="relative">
              <AspectRatio ratio={1440 / 730}>
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <span className="text-4xl font-bold text-foreground/30">
                      {index + 1}
                    </span>
                  </div>
                )}
              </AspectRatio>
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center">
                  <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground ml-1" />
                </div>
              </div>
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(item.duration)}
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <Link
          key={item.id}
          to={item.linkTo}
          className={cn(
            "flex gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group",
            currentLessonId === item.id && "bg-accent"
          )}
        >
          <div className="flex-shrink-0 w-32 relative">
            <AspectRatio ratio={16 / 9}>
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 rounded flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground/30">
                    {index + 1}
                  </span>
                </div>
              )}
            </AspectRatio>
            {currentLessonId !== item.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            )}
            {item.duration && (
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded text-[10px]">
                {formatDuration(item.duration)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 py-0.5">
            <div className="flex items-start gap-2">
              {item.completed && (
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h4>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
