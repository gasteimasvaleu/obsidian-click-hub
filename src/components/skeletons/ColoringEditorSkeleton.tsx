import { Skeleton } from "@/components/ui/skeleton";

export const ColoringEditorSkeleton = () => (
  <div className="min-h-screen bg-background flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between p-3 border-b border-border">
      <Skeleton className="h-8 w-20 rounded-md" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-8 w-20 rounded-md" />
    </div>
    {/* Canvas area */}
    <div className="flex-1 p-3 flex items-center justify-center">
      <Skeleton className="w-full max-w-md aspect-square rounded-xl" />
    </div>
    {/* Controls */}
    <div className="p-3 pb-28 space-y-3 border-t border-border">
      <Skeleton className="h-6 w-full rounded-full" />
      <div className="flex gap-2 justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 rounded-lg" />
        ))}
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-full" />
        ))}
      </div>
    </div>
  </div>
);
