import { Skeleton } from "@/components/ui/skeleton";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";

export const DevotionalSkeleton = () => (
  <div className="min-h-screen bg-background pb-24">
    <FuturisticNavbar />
    <div className="container mx-auto px-4 pt-20 max-w-3xl space-y-6">
      {/* Video banner */}
      <div className="flex justify-center w-full">
        <Skeleton className="w-full max-w-[500px] h-[200px] rounded-xl" />
      </div>

      {/* Theme card */}
      <div className="rounded-xl border border-border p-6 space-y-3">
        <Skeleton className="h-4 w-32 mx-auto" />
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-5 w-48 mx-auto" />
      </div>

      {/* Section cards */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl border border-border p-6 space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  </div>
);
