import { GlassCard } from "@/components/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";

export const EbookItemSkeleton = () => {
  return (
    <GlassCard className="animate-pulse">
      <div className="flex gap-4">
        <Skeleton className="h-32 w-24 rounded-lg bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-3/4 bg-white/10" />
          <Skeleton className="h-4 w-full bg-white/10" />
          <Skeleton className="h-4 w-5/6 bg-white/10" />
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-4 w-16 bg-white/10" />
            <Skeleton className="h-4 w-20 bg-white/10" />
          </div>
        </div>
      </div>
      <Skeleton className="h-12 w-full rounded-lg mt-4 bg-white/10" />
    </GlassCard>
  );
};
