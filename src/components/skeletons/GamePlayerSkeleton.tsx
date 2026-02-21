import { Skeleton } from "@/components/ui/skeleton";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";

export const GamePlayerSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
    <FuturisticNavbar />
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-[50vh] w-full rounded-xl" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>
    </div>
  </div>
);
