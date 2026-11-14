import { useState } from "react";
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

const DESCRIPTION_LIMIT = 90;

function SectionDescription({ text, attached }: { text: string; attached: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const long = text.length > DESCRIPTION_LIMIT;
  const shown = !long || expanded ? text : text.slice(0, DESCRIPTION_LIMIT).trimEnd() + "…";
  return (
    <div className={cn("glass feature-bubble relative z-[1] rounded-2xl px-4 pb-3 text-sm text-foreground", attached ? "-mt-3 rounded-t-none pt-5" : "pt-3")}>
      <p className="relative">
        {shown}
        {long && (
          <button type="button" onClick={() => setExpanded((v) => !v)} className="ml-1 font-semibold text-primary">
            {expanded ? "Ver menos" : "Ver mais"}
          </button>
        )}
      </p>
    </div>
  );
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
            <div className="neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl px-4 py-3 text-feature-foreground">
              <span aria-hidden className="border-beam" />
              <h2 className="relative text-lg md:text-xl font-bold">{title}</h2>
            </div>
          )}
          {description && (
            <SectionDescription text={description} attached={!!title} />
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
                    <span className="text-foreground text-sm font-medium line-clamp-2">
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
