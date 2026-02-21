import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { CheckCircle2, Share2, FileDown } from "lucide-react";
import { DevotionalSkeleton } from "@/components/skeletons/DevotionalSkeleton";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from 'jspdf';

export default function DailyDevotionalPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [userNotes, setUserNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: devotional, isLoading, error } = useQuery({
    queryKey: ['daily-devotional'],
    queryFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('daily_devotionals')
        .select('*')
        .eq('devotional_date', today)
        .eq('available', true)
        .single();
      
      // Se não houver devocional, retornar null (não throw error)
      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data;
    }
  });

  const { data: progress } = useQuery({
    queryKey: ['devotional-progress', devotional?.id, user?.id],
    queryFn: async () => {
      if (!user || !devotional) return null;
      const { data, error } = await supabase
        .from('user_devotional_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('devotional_id', devotional.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!devotional
  });

  useEffect(() => {
    if (progress?.user_notes) {
      setUserNotes(progress.user_notes);
    }
  }, [progress]);

  // Mutation para gerar devocional automaticamente
  const generateDevotionalMutation = useMutation({
    mutationFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data, error } = await supabase.functions.invoke('generate-devotional', {
        body: { date: today, count: 1 }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-devotional'] });
      toast.success('✨ Devocional gerado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao gerar devocional:', error);
      if (error.message?.includes('Rate limit')) {
        toast.error('Limite de requisições atingido. Tente novamente em 1 minuto.');
      } else if (error.message?.includes('Créditos')) {
        toast.error('Créditos insuficientes. Adicione fundos no Lovable AI.');
      } else {
        toast.error(error.message || 'Erro ao gerar devocional');
      }
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  // Auto-gerar quando não houver devocional
  useEffect(() => {
    if (!isLoading && !devotional && !isGenerating && !error) {
      setIsGenerating(true);
      generateDevotionalMutation.mutate();
    }
  }, [devotional, isLoading, isGenerating, error]);

  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user || !devotional) throw new Error('Dados incompletos');

      await supabase
        .from('user_devotional_progress')
        .upsert({
          user_id: user.id,
          devotional_id: devotional.id,
          marked_as_read: true,
          completed_at: new Date().toISOString()
        });

      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'devotional_completed',
          activity_title: devotional.title,
          points_earned: 10
        });

      // Increment devotionals_completed and total_points
      const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('devotionals_completed, total_points')
        .eq('user_id', user.id)
        .single();

      await supabase
        .from('user_progress')
        .update({ 
          devotionals_completed: (currentProgress?.devotionals_completed || 0) + 1,
          total_points: (currentProgress?.total_points || 0) + 10
        })
        .eq('user_id', user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devotional-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      toast.success('🎉 Devocional concluído! +10 pontos');
    }
  });

  const saveNotesMutation = useMutation({
    mutationFn: async () => {
      if (!user || !devotional) throw new Error('Dados incompletos');

      // Verificar se já existe um registro
      const { data: existing } = await supabase
        .from('user_devotional_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('devotional_id', devotional.id)
        .single();

      if (existing) {
        // Se existe, fazer UPDATE apenas do user_notes
        await supabase
          .from('user_devotional_progress')
          .update({ user_notes: userNotes })
          .eq('user_id', user.id)
          .eq('devotional_id', devotional.id);
      } else {
        // Se não existe, criar novo registro
        await supabase
          .from('user_devotional_progress')
          .insert({
            user_id: user.id,
            devotional_id: devotional.id,
            user_notes: userNotes
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devotional-progress'] });
      toast.success('Anotações salvas com sucesso!');
    }
  });

  const handleShare = async () => {
    if (!devotional) return;
    
    // Formatar data para português
    const formattedDate = format(parseISO(devotional.devotional_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    
    // Montar texto completo do devocional
    const shareText = `📿 DEVOCIONAL DIÁRIO
  
📅 ${formattedDate}
━━━━━━━━━━━━━━━━━━━━

✨ ${devotional.theme}

━━━━━━━━━━━━━━━━━━━━
📖 VERSÍCULO DO DIA
${devotional.book_name} ${devotional.chapter}:${devotional.verse_start}${devotional.verse_end ? `-${devotional.verse_end}` : ''}

"${devotional.verse_text}"

━━━━━━━━━━━━━━━━━━━━
📝 INTRODUÇÃO

${devotional.introduction}

━━━━━━━━━━━━━━━━━━━━
💭 REFLEXÃO

${devotional.reflection}

━━━━━━━━━━━━━━━━━━━━
🤔 PARA REFLETIR

${devotional.question}

━━━━━━━━━━━━━━━━━━━━
🎯 APLICAÇÕES PRÁTICAS

${devotional.practical_applications}

━━━━━━━━━━━━━━━━━━━━
🙏 ORAÇÃO

${devotional.prayer}

━━━━━━━━━━━━━━━━━━━━`;
    
    if (navigator.share) {
      try {
        await navigator.share({ 
          text: shareText,
          title: `Devocional: ${devotional.theme}`
        });
        toast.success("Compartilhado com sucesso!");
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          toast.error("Erro ao compartilhar");
        }
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Conteúdo completo copiado para área de transferência!");
    }
  };

  const handleGeneratePDF = () => {
    if (!devotional) return;
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = 20;

      // Título
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(devotional.theme, maxWidth);
      doc.text(titleLines, margin, yPosition);
      yPosition += titleLines.length * 10 + 10;

      // Data
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(
        format(parseISO(devotional.devotional_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR }), 
        margin, 
        yPosition
      );
      yPosition += 15;

      // Versículo
      doc.setFont('helvetica', 'bold');
      doc.text(
        `${devotional.book_name} ${devotional.chapter}:${devotional.verse_start}${devotional.verse_end ? `-${devotional.verse_end}` : ''}`, 
        margin, 
        yPosition
      );
      yPosition += 10;
      
      doc.setFont('helvetica', 'italic');
      const verseLines = doc.splitTextToSize(`"${devotional.verse_text}"`, maxWidth);
      doc.text(verseLines, margin, yPosition);
      yPosition += verseLines.length * 7 + 15;

      // Introdução
      doc.setFont('helvetica', 'bold');
      doc.text('Introdução', margin, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const introLines = doc.splitTextToSize(devotional.introduction, maxWidth);
      doc.text(introLines, margin, yPosition);
      yPosition += introLines.length * 7 + 10;

      // Reflexão
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text('Reflexão', margin, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const reflectionLines = doc.splitTextToSize(devotional.reflection, maxWidth);
      doc.text(reflectionLines, margin, yPosition);
      yPosition += reflectionLines.length * 7 + 10;

      // Aplicações Práticas
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text('Aplicações Práticas', margin, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      const practicalLines = doc.splitTextToSize(devotional.practical_applications, maxWidth);
      doc.text(practicalLines, margin, yPosition);
      yPosition += practicalLines.length * 7 + 10;

      // Oração
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text('Oração', margin, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'italic');
      const prayerLines = doc.splitTextToSize(devotional.prayer, maxWidth);
      doc.text(prayerLines, margin, yPosition);
      yPosition += prayerLines.length * 7;

      // Anotações do usuário (se existirem)
      if (userNotes && userNotes.trim()) {
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        } else {
          yPosition += 15;
        }
        doc.setFont('helvetica', 'bold');
        doc.text('Minhas Anotações', margin, yPosition);
        yPosition += 7;
        doc.setFont('helvetica', 'normal');
        const notesLines = doc.splitTextToSize(userNotes, maxWidth);
        doc.text(notesLines, margin, yPosition);
      }

      // Salvar arquivo
      const fileName = `devocional-${devotional.devotional_date}.pdf`;
      doc.save(fileName);
      toast.success("PDF gerado com sucesso! 📄");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erro ao gerar PDF");
    }
  };

  // Loading state para geração
  if (isLoading || isGenerating || generateDevotionalMutation.isPending) {
    return <DevotionalSkeleton />;
  }

  if (!devotional) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <FuturisticNavbar />
        <p className="text-foreground text-xl">Nenhum devocional disponível hoje</p>
      </div>
    );
  }

  const isCompleted = progress?.marked_as_read || false;

  return (
    <div className="min-h-screen bg-background pb-24">
      <FuturisticNavbar />
      
      <div className="container mx-auto px-4 pt-20 max-w-3xl">
        {/* Video animation */}
        <div className="flex justify-center w-full mb-8">
          <GlassCard className="w-full max-w-[500px] p-0 overflow-hidden">
            <video
              src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/video_6b50c453_1763462346092.mp4"
              className="w-full h-auto"
              style={{ maxHeight: '300px' }}
              autoPlay
              muted
              playsInline
              onEnded={(e) => {
                e.currentTarget.currentTime = 0;
              }}
            />
          </GlassCard>
        </div>

        <GlassCard className="mb-6 text-center bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-400/30">
          <p className="text-muted-foreground text-sm mb-4">
            📅 {format(parseISO(devotional.devotional_date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
          
          <h1 className="text-4xl font-bold text-foreground mb-3">
            {devotional.theme}
          </h1>
          
          <p className="text-blue-400 text-lg">
            📖 {devotional.book_name} {devotional.chapter}:{devotional.verse_start}
            {devotional.verse_end && `-${devotional.verse_end}`}
          </p>
        </GlassCard>

        <GlassCard className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-3">📝 Introdução</h2>
          <p className="text-muted-foreground leading-relaxed">{devotional.introduction}</p>
        </GlassCard>

        <GlassCard className="mb-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/30">
          <h2 className="text-xl font-semibold text-foreground mb-3">✨ Versículo do Dia</h2>
          <p className="text-foreground text-lg italic leading-relaxed mb-2">
            "{devotional.verse_text}"
          </p>
          <p className="text-blue-400">
            - {devotional.book_name} {devotional.chapter}:{devotional.verse_start}
          </p>
        </GlassCard>

        <GlassCard className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-3">💭 Reflexão</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{devotional.reflection}</p>
        </GlassCard>

        <GlassCard className="mb-6 bg-yellow-500/5 border-yellow-400/30">
          <h2 className="text-xl font-semibold text-foreground mb-3">🤔 Para Refletir</h2>
          <p className="text-muted-foreground leading-relaxed italic">{devotional.question}</p>
        </GlassCard>

        <GlassCard className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-3">🎯 Aplicações Práticas</h2>
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {devotional.practical_applications}
          </div>
        </GlassCard>

        <GlassCard className="mb-6 bg-purple-500/5 border-purple-400/30">
          <h2 className="text-xl font-semibold text-foreground mb-3">🙏 Oração</h2>
          <p className="text-muted-foreground leading-relaxed italic">{devotional.prayer}</p>
        </GlassCard>

        <div className="flex flex-wrap gap-3 mb-6">
          {user && !isCompleted && (
            <Button 
              onClick={() => markAsReadMutation.mutate()}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 size={20} className="mr-2" />
              Marcar como Lido
            </Button>
          )}
          
          {isCompleted && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-400/30 rounded-lg">
              <CheckCircle2 size={20} className="text-green-400" />
              <span className="text-green-400 font-semibold">Concluído</span>
            </div>
          )}

          <Button variant="outline" onClick={handleShare}>
            <Share2 size={20} className="mr-2" />
            Compartilhar
          </Button>

          <Button variant="outline" onClick={handleGeneratePDF}>
            <FileDown size={20} className="mr-2" />
            Salvar em PDF
          </Button>
        </div>

        {user && (
          <GlassCard>
            <h2 className="text-xl font-semibold text-foreground mb-3">📝 Minhas Anotações</h2>
            <Textarea
              placeholder="Escreva suas reflexões pessoais sobre este devocional..."
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              rows={5}
              className="mb-3"
            />
            <Button 
              onClick={() => saveNotesMutation.mutate()}
              disabled={!userNotes.trim()}
            >
              Salvar Anotação
            </Button>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
