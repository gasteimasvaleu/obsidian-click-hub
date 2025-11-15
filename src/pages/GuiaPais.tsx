import { useState } from "react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { ParentsGuideForm } from "@/components/guia-pais/ParentsGuideForm";
import { GuideDisplay } from "@/components/guia-pais/GuideDisplay";
import { useToast } from "@/hooks/use-toast";

export interface FormData {
  nome: string;
  sexo: 'masculino' | 'feminino' | '';
  idade: number;
  comportamento: string[];
  personalidade: string[];
  nivelBiblico: 'iniciante' | 'intermediario' | 'avancado' | '';
  contexto: string;
  desafio: string;
  passagem: string;
}

export interface Guide {
  perfil_crianca: string;
  contexto_passagem: string;
  objetivos: string[];
  roteiro_conversa: {
    passo: number;
    titulo: string;
    descricao: string;
    tempo_estimado: string;
  }[];
  atividades_praticas: {
    titulo: string;
    descricao: string;
    materiais: string[];
    duracao: string;
  }[];
  frases_prontas: {
    iniciar: string[];
    explicar: string[];
    perguntas: string[];
  };
  desafios_solucoes: {
    desafio: string;
    solucao: string;
  }[];
  plano_reforco: {
    primeira_semana: string[];
    proximos_dias: string[];
  };
  recursos_extras: {
    tipo: string;
    titulo: string;
    descricao: string;
  }[];
  dicas_personalizadas: string[];
}

const GuiaPais = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    sexo: '',
    idade: 7,
    comportamento: [],
    personalidade: [],
    nivelBiblico: '',
    contexto: '',
    desafio: '',
    passagem: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGuide, setGeneratedGuide] = useState<Guide | null>(null);
  const { toast } = useToast();

  const handleGenerateGuide = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-parents-guide`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ formData })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar guia');
      }

      const { guide } = await response.json();
      setGeneratedGuide(guide);
      
      toast({
        title: "✅ Guia personalizado criado!",
        description: "Seu guia está pronto para usar.",
      });

      // Scroll suave para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Erro ao gerar guia:', error);
      toast({
        title: "Erro ao gerar guia",
        description: error instanceof Error ? error.message : 'Tente novamente.',
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewGuide = () => {
    setGeneratedGuide(null);
    setFormData({
      nome: '',
      sexo: '',
      idade: 7,
      comportamento: [],
      personalidade: [],
      nivelBiblico: '',
      contexto: '',
      desafio: '',
      passagem: ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black relative pb-24">
      <FuturisticNavbar />
      
      <div className="pt-16 px-4">
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
        {/* Video animation */}
        <div className="flex justify-center w-full mb-8">
          <GlassCard className="w-full max-w-[500px] p-0 overflow-hidden">
              <video
                src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/guipais.mp4"
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
          
          {!generatedGuide ? (
            <ParentsGuideForm
              formData={formData}
              setFormData={setFormData}
              onGenerate={handleGenerateGuide}
              isGenerating={isGenerating}
            />
          ) : (
            <GuideDisplay 
              guide={generatedGuide} 
              formData={formData}
              onNewGuide={handleNewGuide}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GuiaPais;
