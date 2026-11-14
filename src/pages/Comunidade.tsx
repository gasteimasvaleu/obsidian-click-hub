import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { useState } from "react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { PostForm } from "@/components/comunidade/PostForm";
import { PostCard } from "@/components/comunidade/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { MessagesSquare } from "lucide-react";
import { PostCardSkeleton } from "@/components/skeletons/PostCardSkeleton";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

const Comunidade = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  // Fetch posts with author profile
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["community-posts", page],
    queryFn: async () => {
      const from = 0;
      const to = page * PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from("community_posts")
        .select("*, profiles:user_id(full_name, avatar_url)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { posts: data || [], total: count || 0 };
    },
  });

  // Fetch user's likes
  const { data: userLikes = [] } = useQuery({
    queryKey: ["community-user-likes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("community_likes")
        .select("post_id")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map((l: any) => l.post_id);
    },
    enabled: !!user,
  });

  const posts = postsData?.posts || [];
  const totalPosts = postsData?.total || 0;
  const hasMore = posts.length < totalPosts;

  return (
    <div className="min-h-screen bg-background relative flex flex-col pb-24">
      <FuturisticNavbar />

      {/* Video Banner */}
      <div className="flex justify-center w-full pt-16 pb-4 px-4">
        <GlassCard className="w-full max-w-4xl p-0 overflow-hidden">
          <video 
            src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/bannercomunidade.mp4"
            className="aspect-video w-full h-auto object-cover"
            autoPlay
            muted
            playsInline
            onEnded={(e) => {
              const video = e.currentTarget;
              video.currentTime = 0;
            }}
          />
        </GlassCard>
      </div>

      <div className="flex-1 px-4 pb-8">
        <div className="w-full max-w-4xl mx-auto space-y-4">
          {/* Header */}
          <SectionHeader title="Comunidade" className="mb-2" />

          {/* Post Form */}
          <PostForm />

          {/* Feed */}
          {postsLoading && posts.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <PostCardSkeleton key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <MessagesSquare size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">
                Nenhuma publicação ainda. Seja o primeiro a compartilhar!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {posts.map((post: any) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isLiked={userLikes.includes(post.id)}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setPage((p) => p + 1)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    Carregar mais
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comunidade;
