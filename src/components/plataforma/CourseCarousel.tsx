import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface CourseCarouselItem {
  id: string;
  title: string;
  thumbnail?: string;
  linkTo: string;
}

interface CourseCarouselProps {
  items: CourseCarouselItem[];
  title?: string;
  description?: string;
  className?: string;
}

export function CourseCarousel({
  items,
  title,
  description,
  className,
}: CourseCarouselProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      {(title || description) && (
        <div className="mb-4 px-4">
          {title && (
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      <Carousel
        opts={{
          align: "start",
          loop: items.length > 2,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <Link to={item.linkTo} className="block group">
                <div className="relative overflow-hidden rounded-lg">
                  <AspectRatio ratio={300 / 580}>
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                        <span className="text-foreground/50 text-center text-sm px-2">
                          {item.title}
                        </span>
                      </div>
                    )}
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-white text-sm font-medium line-clamp-2">
                      {item.title}
                    </span>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      {items.length > 1 && (
          <>
            <CarouselPrevious className="flex left-1 md:-left-4" />
            <CarouselNext className="flex right-1 md:-right-4" />
          </>
        )}
      </Carousel>
    </div>
  );
}
