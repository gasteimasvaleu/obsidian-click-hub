import type { ReactNode } from "react";
import { GlassCard } from "@/components/GlassCard";
import { BubbleTitleText } from "@/components/ui/bubble-title-text";
import { cn } from "@/lib/utils";

/** Padrão do app: título em bolha violeta + card branco anexado embaixo. */
export function BubbleSection({
  title, titleExtra, children, className, cardClassName, as: Tag = "h2",
}: {
  title: string;
  titleExtra?: ReactNode;
  children: ReactNode;
  className?: string;
  cardClassName?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <section className={cn("mb-6", className)}>
      <div className="neon-glow-user feature-bubble bubble-user relative z-[2] flex items-center gap-2 rounded-2xl px-4 py-3 text-feature-foreground">
        <span className="border-beam" aria-hidden />
        <Tag className="bubble-title relative min-w-0 flex-1"><BubbleTitleText text={title} /></Tag>
        {titleExtra && <div className="relative shrink-0">{titleExtra}</div>}
      </div>
      <GlassCard className={cn("-mt-4 rounded-t-none pt-7", cardClassName)}>{children}</GlassCard>
    </section>
  );
}

export const SPLIT_BAR = "flex w-full overflow-hidden rounded-full border border-border bg-card divide-x divide-border";
