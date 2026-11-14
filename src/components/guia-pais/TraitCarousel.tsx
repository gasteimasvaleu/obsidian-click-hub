import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import { cn } from "@/lib/utils";

const assets = import.meta.glob<{ default: { url: string } }>("@/assets/guia-pais/tracos/*.png.asset.json", { eager: true });

const slug = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

export function traitImage(option: string): string | undefined {
  const key = Object.keys(assets).find((k) => k.endsWith(`/${slug(option)}.png.asset.json`));
  return key ? assets[key].default.url : undefined;
}

type Props = {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
};

export function TraitCarousel({ options, selected, onToggle }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => setIndex(api.selectedScrollSnap());
    update();
    api.on("select", update);
    return () => { api.off("select", update); };
  }, [api]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ArrowNavButton direction="left" label="Anterior" onClick={() => api?.scrollPrev()} className="!w-12 !h-12 shrink-0" />
        <Carousel setApi={setApi} opts={{ loop: true }} className="min-w-0 flex-1">
          <CarouselContent>
            {options.map((option) => {
              const isOn = selected.includes(option);
              const img = traitImage(option);
              return (
                <CarouselItem key={option}>
                  <button
                    type="button"
                    onClick={() => onToggle(option)}
                    aria-pressed={isOn}
                    className={cn(
                      "relative flex aspect-square w-full flex-col items-center justify-center rounded-2xl border-2 bg-card p-4 transition-all",
                      isOn ? "border-primary bg-primary/10" : "border-border"
                    )}
                  >
                    {isOn && (
                      <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                    )}
                    {img && <img src={img} alt="" loading="lazy" className="h-3/4 w-3/4 object-contain" />}
                    <span className="mt-2 text-lg font-bold text-foreground">{option}</span>
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        <ArrowNavButton direction="right" label="Próximo" onClick={() => api?.scrollNext()} className="!w-12 !h-12 shrink-0" />
      </div>
      <div className="flex justify-center gap-1.5">
        {options.map((o, i) => (
          <button
            key={o}
            type="button"
            aria-label={o}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-5" : "w-2",
              selected.includes(o) ? "bg-primary" : i === index ? "bg-primary/50" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {selected.length} {selected.length === 1 ? "selecionada" : "selecionadas"}
      </p>
    </div>
  );
}
