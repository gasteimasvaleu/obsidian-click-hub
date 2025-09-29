import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Gamepad2, Users } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

const Dashboard = () => {
  const [stats, setStats] = useState({
    ebooks: 0,
    games: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [ebooksRes, gamesRes] = await Promise.all([
      supabase.from('ebooks').select('id', { count: 'exact', head: true }),
      supabase.from('games').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      ebooks: ebooksRes.count || 0,
      games: gamesRes.count || 0,
    });
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8">Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Ebooks
                </CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.ebooks}</div>
              </CardContent>
            </Card>

            <Card className="glass border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Jogos
                </CardTitle>
                <Gamepad2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.games}</div>
              </CardContent>
            </Card>

            <Card className="glass border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  IA Disponível
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-primary">Gemini 2.5 Flash</div>
                <p className="text-xs text-muted-foreground mt-1">Grátis até 06/10/2025</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;
