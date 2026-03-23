import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BookOpen, Gamepad2, Users, Database, Loader2, Sparkles } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState({
    ebooks: 0,
    games: 0,
    bibleBooks: 0,
    totalDevotionals: 0,
  });
  const [isImporting, setIsImporting] = useState(false);
  const [isGeneratingDevotionals, setIsGeneratingDevotionals] = useState(false);
  const [devotionalDays, setDevotionalDays] = useState(7);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [ebooksRes, gamesRes, bibleBooksRes, devotionalsRes] = await Promise.all([
      supabase.from('ebooks').select('id', { count: 'exact', head: true }),
      supabase.from('games').select('id', { count: 'exact', head: true }),
      supabase.from('bible_books').select('id', { count: 'exact', head: true }),
      supabase.from('daily_devotionals').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      ebooks: ebooksRes.count || 0,
      games: gamesRes.count || 0,
      bibleBooks: bibleBooksRes.count || 0,
      totalDevotionals: devotionalsRes.count || 0,
    });
  };

  const [importProgress, setImportProgress] = useState({ current: 0, total: 73, books: 0, chapters: 0, verses: 0 });

  const handleImportBible = async () => {
    if (stats.bibleBooks > 0) {
      const confirmed = window.confirm(
        'A Bíblia já foi importada. Deseja reimportar? Isso apagará todos os dados existentes (favoritos, notas, histórico).'
      );
      if (!confirmed) return;
    }

    setIsImporting(true);
    setImportProgress({ current: 0, total: 73, books: 0, chapters: 0, verses: 0 });

    try {
      // Step 1: Clean existing data
      toast.info('Limpando dados antigos...');
      const { error: cleanError } = await supabase.functions.invoke('import-bible-data', {
        body: null,
        headers: { 'Content-Type': 'application/json' },
      });
      // Use GET with query params via direct fetch
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      const cleanRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/import-bible-data?clean=true&cleanOnly=true`,
        { headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
      );
      if (!cleanRes.ok) throw new Error('Falha ao limpar dados');
      toast.success('Dados antigos removidos!');

      // Step 2: Import in batches of 2
      const batchSize = 2;
      let start = 0;
      let hasMore = true;
      let totalBooks = 0, totalChapters = 0, totalVerses = 0;

      while (hasMore) {
        toast.info(`Importando livros ${start + 1} a ${start + batchSize}...`);
        
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/import-bible-data?start=${start}&batch=${batchSize}`,
          { headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
        );
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Erro no lote start=${start}`);
        }
        
        const data = await res.json();
        totalBooks += data.imported.books;
        totalChapters += data.imported.chapters;
        totalVerses += data.imported.verses;
        hasMore = data.hasMore;
        start = data.nextStart || start + batchSize;
        
        setImportProgress({
          current: start,
          total: data.batch.total,
          books: totalBooks,
          chapters: totalChapters,
          verses: totalVerses,
        });
      }

      toast.success(
        `✅ Bíblia Ave Maria importada!\n📚 ${totalBooks} livros\n📖 ${totalChapters} capítulos\n✍️ ${totalVerses} versículos`
      );
      loadStats();
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(`Erro na importação: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleGenerateDevotionals = async () => {
    if (isGeneratingDevotionals) return;

    const confirmed = window.confirm(
      `Gerar ${devotionalDays} devocionais usando IA?\n\n` +
      `Isso consumirá créditos da Lovable AI.\n` +
      `Tempo estimado: ${Math.ceil(devotionalDays * 0.5)} minutos.`
    );

    if (!confirmed) return;

    setIsGeneratingDevotionals(true);
    toast.info(`Gerando ${devotionalDays} devocionais...`, { duration: 3000 });

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data, error } = await supabase.functions.invoke('generate-devotional', {
        body: { date: today, count: devotionalDays }
      });

      if (error) throw error;

      toast.success(
        `✨ ${data.generated} devocionais gerados com sucesso!`,
        { duration: 5000 }
      );
      loadStats();
    } catch (error: any) {
      console.error('Erro ao gerar devocionais:', error);
      if (error.message?.includes('Rate limit')) {
        toast.error('Limite de requisições atingido. Aguarde 1 minuto e tente novamente.');
      } else if (error.message?.includes('Créditos')) {
        toast.error('Créditos insuficientes. Adicione fundos no Lovable.');
      } else {
        toast.error('Erro ao gerar devocionais: ' + error.message);
      }
    } finally {
      setIsGeneratingDevotionals(false);
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
                    <CardTitle className="text-foreground">Importar Bíblia Ave Maria</CardTitle>
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
                  <p className="mb-2">Esta função importará a Bíblia Católica completa:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>📚 73 livros (46 AT + 27 NT, incluindo Deuterocanônicos)</li>
                    <li>📖 ~1.328 capítulos</li>
                    <li>✍️ ~35.000 versículos</li>
                  </ul>
                  <p className="mt-3 text-xs">
                    Fonte: <span className="text-primary">fidalgobr/bibliaAveMariaJSON (GitHub)</span>
                  </p>
                  <p className="mt-1 text-xs">
                    Versão: <span className="text-primary">Ave Maria (Católica)</span>
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
                  <div className="space-y-2">
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((importProgress.current / importProgress.total) * 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      📚 {importProgress.books} livros | 📖 {importProgress.chapters} capítulos | ✍️ {importProgress.verses} versículos
                      <br />
                      Progresso: {importProgress.current}/{importProgress.total} livros processados
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card de Geração de Devocionais com IA */}
          <Card className="glass border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5 mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Gerar Devocionais com IA</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stats.totalDevotionals === 0 
                        ? 'Nenhum devocional gerado ainda' 
                        : `${stats.totalDevotionals} devocionais já criados`}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Usa Lovable AI para gerar devocionais automaticamente:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>✨ Conteúdo único e relevante</li>
                    <li>📖 Baseado em versículos bíblicos reais</li>
                    <li>🎯 Aplicações práticas do dia-a-dia</li>
                  </ul>
                  <p className="mt-3 text-xs">
                    Modelo: <span className="text-primary">Gemini 2.5 Flash</span>
                  </p>
                  <p className="mt-1 text-xs">
                    Custo: <span className="text-primary">~$0.02 por devocional</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Label className="text-foreground">Gerar próximos:</Label>
                  <select
                    value={devotionalDays}
                    onChange={(e) => setDevotionalDays(Number(e.target.value))}
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-foreground"
                    disabled={isGeneratingDevotionals}
                  >
                    <option value={7}>7 dias</option>
                    <option value={15}>15 dias</option>
                    <option value={30}>30 dias</option>
                  </select>
                </div>

                <Button
                  onClick={handleGenerateDevotionals}
                  disabled={isGeneratingDevotionals || stats.bibleBooks === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isGeneratingDevotionals ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando... (~{Math.ceil(devotionalDays * 0.5)}min)
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Gerar {devotionalDays} Devocionais
                    </>
                  )}
                </Button>

                {stats.bibleBooks === 0 && (
                  <p className="text-xs text-yellow-400 text-center">
                    ⚠️ Importe a Bíblia primeiro para usar esta função
                  </p>
                )}

                {isGeneratingDevotionals && (
                  <div className="text-xs text-muted-foreground text-center">
                    ⏳ Gerando devocionais... Isso pode levar alguns minutos.
                  </div>
                )}

                <p className="text-xs text-yellow-400">
                  💡 Dica: Devocionais são gerados automaticamente quando usuários acessam /devocional
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;
