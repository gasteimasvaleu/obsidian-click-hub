import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Flame, TrendingUp } from "lucide-react";
import { DevotionalCard } from "./DevotionalCard";
import { DevotionalDetailModal } from "./DevotionalDetailModal";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";

interface DevotionalHistoryTabProps {
  userId: string;
}

interface DevotionalProgress {
  id: string;
  user_notes: string | null;
  completed_at: string;
  devotional: any;
}

const calculateStats = (history: DevotionalProgress[]) => {
  if (!history || history.length === 0) {
    return { totalRead: 0, streak: 0, weeklyAvg: "0" };
  }
  
  const totalRead = history.length;
  
  // Calcular sequência atual
  let streak = 0;
  const sortedByDate = [...history].sort((a, b) => 
    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );
  
  let lastDate = new Date();
  lastDate.setHours(0, 0, 0, 0);
  
  for (const item of sortedByDate) {
    const itemDate = new Date(item.completed_at);
    itemDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((lastDate.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
      lastDate = itemDate;
    } else {
      break;
    }
  }
  
  // Média semanal (últimos 30 dias)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const lastMonthCount = history.filter(item => 
    new Date(item.completed_at) >= thirtyDaysAgo
  ).length;
  const weeklyAvg = (lastMonthCount / 4).toFixed(1);
  
  return { totalRead, streak, weeklyAvg };
};

export const DevotionalHistoryTab = ({ userId }: DevotionalHistoryTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "week" | "month" | "year">("all");
  const [showOnlyWithNotes, setShowOnlyWithNotes] = useState(false);
  const [selectedDevotional, setSelectedDevotional] = useState<DevotionalProgress | null>(null);
  
  const { data: devotionalHistory, isLoading } = useQuery({
    queryKey: ['devotional-history', userId, filterPeriod, showOnlyWithNotes],
    queryFn: async () => {
      let query = supabase
        .from('user_devotional_progress')
        .select(`
          id,
          user_notes,
          completed_at,
          devotional:daily_devotionals(*)
        `)
        .eq('user_id', userId)
        .eq('marked_as_read', true)
        .order('completed_at', { ascending: false });
      
      // Filtro por período
      if (filterPeriod === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('completed_at', weekAgo.toISOString());
      } else if (filterPeriod === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('completed_at', monthAgo.toISOString());
      } else if (filterPeriod === 'year') {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        query = query.gte('completed_at', yearAgo.toISOString());
      }
      
      // Filtro de anotações
      if (showOnlyWithNotes) {
        query = query.not('user_notes', 'is', null);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return data as DevotionalProgress[];
    },
    enabled: !!userId
  });

  const filteredHistory = useMemo(() => {
    if (!devotionalHistory) return [];
    if (!searchTerm) return devotionalHistory;
    
    const term = searchTerm.toLowerCase();
    return devotionalHistory.filter(item => 
      item.devotional.theme.toLowerCase().includes(term) ||
      item.devotional.verse_text.toLowerCase().includes(term) ||
      item.devotional.book_name.toLowerCase().includes(term)
    );
  }, [devotionalHistory, searchTerm]);

  const stats = useMemo(() => calculateStats(devotionalHistory || []), [devotionalHistory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mini estatísticas */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass border-primary/20">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-primary">{stats.totalRead}</p>
            <p className="text-xs text-muted-foreground">Lidos</p>
          </CardContent>
        </Card>
        
        <Card className="glass border-primary/20">
          <CardContent className="p-4 text-center">
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-orange-500">{stats.streak}</p>
            <p className="text-xs text-muted-foreground">Sequência</p>
          </CardContent>
        </Card>
        
        <Card className="glass border-primary/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-500">{stats.weeklyAvg}</p>
            <p className="text-xs text-muted-foreground">Média/sem</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Busca */}
      <Input 
        placeholder="🔍 Buscar por tema ou versículo..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="glass"
      />
      
      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={filterPeriod === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterPeriod('all')}
        >
          Todos
        </Button>
        <Button 
          variant={filterPeriod === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterPeriod('week')}
        >
          Semana
        </Button>
        <Button 
          variant={filterPeriod === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterPeriod('month')}
        >
          Mês
        </Button>
        <Button 
          variant={filterPeriod === 'year' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterPeriod('year')}
        >
          Ano
        </Button>
        <Button 
          variant={showOnlyWithNotes ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowOnlyWithNotes(!showOnlyWithNotes)}
        >
          📝 Com anotações
        </Button>
      </div>
      
      {/* Lista de devocionais */}
      {filteredHistory.length === 0 ? (
        <EmptyState 
          icon={<BookOpen className="w-12 h-12" />}
          title="Nenhum devocional encontrado"
          description={searchTerm ? "Tente ajustar sua busca ou filtros" : "Complete devocionais para vê-los aqui"}
        />
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {filteredHistory.map(item => (
            <DevotionalCard 
              key={item.id}
              devotional={item.devotional}
              userNotes={item.user_notes}
              completedAt={item.completed_at}
              onClick={() => setSelectedDevotional(item)}
            />
          ))}
        </div>
      )}
      
      {/* Modal com devocional completo */}
      <DevotionalDetailModal 
        devotional={selectedDevotional}
        open={!!selectedDevotional}
        onClose={() => setSelectedDevotional(null)}
      />
    </div>
  );
};
