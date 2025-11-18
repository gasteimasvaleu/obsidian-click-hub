import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Gamepad2, Users, Database, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { toast } from 'sonner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    ebooks: 0,
    games: 0,
    bibleBooks: 0,
  });
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [ebooksRes, gamesRes, bibleBooksRes] = await Promise.all([
      supabase.from('ebooks').select('id', { count: 'exact', head: true }),
      supabase.from('games').select('id', { count: 'exact', head: true }),
      supabase.from('bible_books').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      ebooks: ebooksRes.count || 0,
      games: gamesRes.count || 0,
      bibleBooks: bibleBooksRes.count || 0,
    });
  };

  const handleImportBible = async () => {
    if (stats.bibleBooks > 0) {
      const confirmed = window.confirm(
        'A Bíblia já foi importada. Deseja reimportar? Isso pode levar alguns minutos.'
      );
      if (!confirmed) return;
    }

    setIsImporting(true);
    toast.info('Iniciando importação da Bíblia ACF...');

    try {
      const { data, error } = await supabase.functions.invoke('import-bible-data');

      if (error) throw error;

      toast.success(
        `✅ Bíblia importada com sucesso!\n📚 ${data.imported.books} livros\n📖 ${data.imported.chapters} capítulos\n✍️ ${data.imported.verses} versículos`
      );
      
      loadStats();
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(`Erro na importação: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8">Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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

          {/* Card de Importação da Bíblia */}
          <Card className="glass border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Importar Bíblia ACF</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stats.bibleBooks === 0 
                        ? 'Nenhum livro importado ainda' 
                        : `${stats.bibleBooks} livros já importados`}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Esta função importará:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>📚 66 livros (Antigo e Novo Testamento)</li>
                    <li>📖 1.189 capítulos</li>
                    <li>✍️ ~31.102 versículos</li>
                  </ul>
                  <p className="mt-3 text-xs">
                    Fonte: <span className="text-primary">thiagobodruk/biblia (GitHub)</span>
                  </p>
                  <p className="mt-1 text-xs">
                    Versão: <span className="text-primary">ACF (Almeida Corrigida Fiel)</span>
                  </p>
                </div>
                
                <Button 
                  onClick={handleImportBible}
                  disabled={isImporting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importando... (pode levar alguns minutos)
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      {stats.bibleBooks === 0 ? 'Importar Bíblia' : 'Reimportar Bíblia'}
                    </>
                  )}
                </Button>

                {isImporting && (
                  <div className="text-xs text-muted-foreground text-center">
                    ⏳ Este processo pode levar de 5 a 10 minutos. Não feche esta página.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;
