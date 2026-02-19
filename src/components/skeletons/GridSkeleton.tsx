import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface GridSkeletonProps {
  rows: number;
  cols: number;
  className?: string;
}

export const GridSkeleton = ({ rows, cols, className }: GridSkeletonProps) => {
  return (
    <div 
      className={cn("grid gap-2", className)}
      style={{ 
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="aspect-square rounded-lg bg-white/10 animate-pulse" 
        />
      ))}
    </div>
  );
};
