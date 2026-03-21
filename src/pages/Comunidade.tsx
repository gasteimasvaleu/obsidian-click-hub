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
    <div className="min-h-screen bg-black relative flex flex-col pb-24">
      <FuturisticNavbar />

      {/* Video Banner */}
      <div className="flex justify-center w-full pt-16 pb-4 px-4">
        <GlassCard className="w-full max-w-[500px] p-0 overflow-hidden">
          <video 
            src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/bannercomunidade.mp4"
            className="w-full h-auto"
            style={{ maxHeight: '300px' }}
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
        <div className="w-full max-w-2xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500">
              <MessagesSquare size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">Comunidade</h1>
          </div>

          {/* Post Form */}
          <PostForm />

          {/* Feed */}
          {postsLoading && posts.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <PostCardSkeleton key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <MessagesSquare size={48} className="mx-auto text-white/20 mb-3" />
              <p className="text-white/40 text-sm">
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
                    className="text-white/60 hover:text-white hover:bg-white/10"
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
