import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface ModulePlaylistItem {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  linkTo: string;
}

interface ModulePlaylistProps {
  items: ModulePlaylistItem[];
  className?: string;
}

export function ModulePlaylist({ items, className }: ModulePlaylistProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum módulo disponível
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <Link
          key={item.id}
          to={item.linkTo}
          className="flex gap-4 p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors group"
        >
          <div className="flex-shrink-0 w-24 md:w-32 relative">
            <AspectRatio ratio={300 / 580}>
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 rounded-md flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground/30">
                    {index + 1}
                  </span>
                </div>
              )}
            </AspectRatio>
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0 py-1">
            <div className="flex items-start gap-2">
              <span className="text-sm text-muted-foreground font-medium">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
