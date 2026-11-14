import { cn } from "@/lib/utils";

export function StepProgress({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="feature-bubble relative rounded-2xl bg-card/40 backdrop-blur-md px-4 py-4 mb-8">
      <div className="relative z-[2] flex items-center justify-between mb-3">
        <span className="font-system font-black tracking-tight text-foreground">
          Passo {current} de {total}
        </span>
        <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
          {pct}%
        </span>
      </div>
      <div
        className="relative z-[2] h-3 w-full overflow-hidden rounded-full bg-primary/10 border border-primary/15"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div
          className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary/70 transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${pct}%`, boxShadow: "0 0 12px hsl(var(--primary) / 0.5)" }}
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent animate-shine motion-reduce:hidden"
          />
        </div>
      </div>
      <div className="relative z-[2] mt-3 flex items-center justify-between px-0.5">
        {Array.from({ length: total }).map((_, i) => {
          const step = i + 1;
          return (
            <span
              key={i}
              className={cn(
                "rounded-full transition-all duration-300 motion-reduce:transition-none",
                step < current && "h-2 w-2 bg-primary",
                step === current && "h-3 w-3 bg-primary ring-4 ring-primary/25",
                step > current && "h-2 w-2 bg-primary/20"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
