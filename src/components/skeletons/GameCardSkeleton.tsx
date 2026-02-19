import { GlassCard } from "@/components/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";

export const GameCardSkeleton = () => {
  return (
    <GlassCard className="animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-12 w-12 rounded-lg bg-white/10" />
        <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-3 bg-white/10" />
      <Skeleton className="h-4 w-full mb-2 bg-white/10" />
      <Skeleton className="h-4 w-5/6 mb-6 bg-white/10" />
      <Skeleton className="h-12 w-full rounded-lg bg-white/10" />
    </GlassCard>
  );
};
