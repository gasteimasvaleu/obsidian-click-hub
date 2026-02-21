import { Skeleton } from "@/components/ui/skeleton";

export const PostCardSkeleton = () => (
  <div className="rounded-xl border border-border p-4 space-y-3">
    {/* Author row */}
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    {/* Content */}
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
    {/* Actions */}
    <div className="flex gap-4 pt-1">
      <Skeleton className="h-8 w-16 rounded-md" />
      <Skeleton className="h-8 w-16 rounded-md" />
    </div>
  </div>
);
