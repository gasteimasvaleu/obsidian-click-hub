import { stripEmoji } from "@/lib/stripEmoji";
import { BubbleTitleText } from "@/components/ui/bubble-title-text";
import { SectionHeader } from "@/components/plataforma/CourseCarousel";
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
import { useLoading } from '@/contexts/LoadingContext';

export default function DailyDevotionalPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [userNotes, setUserNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { showLoading, hideLoading } = useLoading();

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
      toast.success('Devocional gerado com sucesso!');
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
      hideLoading();
    }
  });

  // Auto-gerar quando não houver devocional
  useEffect(() => {
    if (!isLoading && !devotional && !isGenerating && !error) {
      setIsGenerating(true);
      showLoading('Gerando devocional do dia...');
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
      toast.success('Devocional concluído! +10 pontos');
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
    const shareText = `DEVOCIONAL DIÁRIO
  
${formattedDate}
━━━━━━━━━━━━━━━━━━━━

${stripEmoji(devotional.theme)}

━━━━━━━━━━━━━━━━━━━━
VERSÍCULO DO DIA
${devotional.book_name} ${devotional.chapter}:${devotional.verse_start}${devotional.verse_end ? `-${devotional.verse_end}` : ''}

"${stripEmoji(devotional.verse_text)}"

━━━━━━━━━━━━━━━━━━━━
INTRODUÇÃO

${stripEmoji(devotional.introduction)}

━━━━━━━━━━━━━━━━━━━━
REFLEXÃO

${stripEmoji(devotional.reflection)}

━━━━━━━━━━━━━━━━━━━━
PARA REFLETIR

${devotional.question}

━━━━━━━━━━━━━━━━━━━━
APLICAÇÕES PRÁTICAS

${devotional.practical_applications}

━━━━━━━━━━━━━━━━━━━━
ORAÇÃO

${stripEmoji(devotional.prayer)}

━━━━━━━━━━━━━━━━━━━━`;
    
    if (navigator.share) {
      try {
        await navigator.share({ 
          text: shareText,
          title: `Devocional: ${stripEmoji(devotional.theme)}`
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
      const verseLines = doc.splitTextToSize(`"${stripEmoji(devotional.verse_text)}"`, maxWidth);
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
      toast.success("PDF gerado com sucesso!");
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
      
      <div className="container mx-auto px-4 pt-16 max-w-2xl">
        {/* Video animation */}
        <div className="flex justify-center w-full mb-8">
          <GlassCard className="w-full max-w-2xl p-0 overflow-hidden">
            <video
              src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/video_6b50c453_1763462346092.mp4"
              className="aspect-video w-full h-auto object-cover"
              autoPlay
              muted
              playsInline
              onEnded={(e) => {
                e.currentTarget.currentTime = 0;
              }}
            />
          </GlassCard>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <SectionHeader
            title={stripEmoji(devotional.theme)}
            description={`${format(parseISO(devotional.devotional_date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })} · ${devotional.book_name} ${devotional.chapter}:${devotional.verse_start}${devotional.verse_end ? `-${devotional.verse_end}` : ""}`}
            className="mb-6"
          />
        </div>

        <div className="mb-6">
          <div className="neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl px-4 py-3 text-feature-foreground">
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative"><BubbleTitleText text="Introdução" /></h2>
          </div>
          <GlassCard className="-mt-4 pt-7 rounded-t-none">
          <p className="text-muted-foreground leading-relaxed">{stripEmoji(devotional.introduction)}</p>
        </GlassCard>
        </div>

        <div className="mb-6">
          <div className="neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl px-4 py-3 text-feature-foreground">
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative"><BubbleTitleText text="Versículo do Dia" /></h2>
          </div>
          <GlassCard className="-mt-4 pt-7 rounded-t-none">
          <p className="text-foreground text-lg italic leading-relaxed mb-2">
            "{stripEmoji(devotional.verse_text)}"
          </p>
          <p className="text-primary">
            - {devotional.book_name} {devotional.chapter}:{devotional.verse_start}
          </p>
        </GlassCard>
        </div>

        <div className="mb-6">
          <div className="neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl px-4 py-3 text-feature-foreground">
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative"><BubbleTitleText text="Reflexão" /></h2>
          </div>
          <GlassCard className="-mt-4 pt-7 rounded-t-none">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{stripEmoji(devotional.reflection)}</p>
        </GlassCard>
        </div>

        <div className="mb-6">
          <div className="neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl px-4 py-3 text-feature-foreground">
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative"><BubbleTitleText text="Para Refletir" /></h2>
          </div>
          <GlassCard className="-mt-4 pt-7 rounded-t-none">
          <p className="text-muted-foreground leading-relaxed italic">{devotional.question}</p>
        </GlassCard>
        </div>

        <div className="mb-6">
          <div className="neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl px-4 py-3 text-feature-foreground">
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative"><BubbleTitleText text="Aplicações Práticas" /></h2>
          </div>
          <GlassCard className="-mt-4 pt-7 rounded-t-none">
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {devotional.practical_applications}
          </div>
        </GlassCard>
        </div>

        <div className="mb-6">
          <div className="neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl px-4 py-3 text-feature-foreground">
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative"><BubbleTitleText text="Oração" /></h2>
          </div>
          <GlassCard className="-mt-4 pt-7 rounded-t-none">
          <p className="text-muted-foreground leading-relaxed italic">{stripEmoji(devotional.prayer)}</p>
        </GlassCard>
        </div>

        <div
          className="neon-glow-user feature-bubble bubble-user relative rounded-2xl mb-6 grid divide-x divide-primary-foreground/25 overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${user || isCompleted ? 3 : 2}, minmax(0, 1fr))` }}
        >
          <span aria-hidden className="border-beam" />
          {(user || isCompleted) && (
            <button
              type="button"
              onClick={() => markAsReadMutation.mutate()}
              disabled={isCompleted}
              aria-label={isCompleted ? "Concluído" : "Marcar como lido"}
              className="relative z-[2] flex flex-col items-center gap-1 py-3 text-primary-foreground text-xs font-semibold transition-colors hover:bg-primary-foreground/10 active:bg-foreground/10 disabled:cursor-default disabled:hover:bg-transparent"
            >
              <CheckCircle2 size={22} className={isCompleted ? "fill-primary-foreground/30" : ""} />
              {isCompleted ? "Concluído" : "Lido"}
            </button>
          )}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Compartilhar"
            className="relative z-[2] flex flex-col items-center gap-1 py-3 text-primary-foreground text-xs font-semibold transition-colors hover:bg-primary-foreground/10 active:bg-foreground/10"
          >
            <Share2 size={22} />
            Compartilhar
          </button>
          <button
            type="button"
            onClick={handleGeneratePDF}
            aria-label="Salvar em PDF"
            className="relative z-[2] flex flex-col items-center gap-1 py-3 text-primary-foreground text-xs font-semibold transition-colors hover:bg-primary-foreground/10 active:bg-foreground/10"
          >
            <FileDown size={22} />
            PDF
          </button>
        </div>

        {user && (
          <div className="mb-6">
            <div className="neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl px-4 py-3 text-feature-foreground">
              <span aria-hidden className="border-beam" />
              <h2 className="bubble-title relative"><BubbleTitleText text="Minhas Anotações" /></h2>
            </div>
            <GlassCard className="-mt-4 pt-7 rounded-t-none">
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
          </div>
        )}
      </div>
    </div>
  );
}
