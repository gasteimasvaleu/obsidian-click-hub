import { ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import meninoImg from "@/assets/guia-pais/menino.png";
import meninaImg from "@/assets/guia-pais/menina.png";
import { StepProgress } from "@/components/guia-pais/StepProgress";
import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { useState } from "react";
import { FormData } from "@/pages/GuiaPais";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { TraitCarousel } from "@/components/guia-pais/TraitCarousel";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/GlassCard";

interface ParentsGuideFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const comportamentoOptions = [
  "Agitado", "Tímido", "Curioso", "Questionador", 
  "Obediente", "Desafiador", "Sensível", "Carinhoso", "Independente"
];

const personalidadeOptions = [
  "Extrovertido", "Introvertido", "Criativo", "Lógico",
  "Emocional", "Racional", "Competitivo", "Colaborativo", "Aventureiro"
];

export const ParentsGuideForm = ({ 
  formData, 
  setFormData, 
  onGenerate,
  isGenerating 
}: ParentsGuideFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleArrayItem = (field: 'comportamento' | 'personalidade', item: string) => {
    const current = formData[field];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateFormData(field, updated);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.nome.length >= 2;
      case 2: return formData.sexo !== '';
      case 3: return true; // idade sempre válida
      case 4: return formData.comportamento.length > 0;
      case 5: return formData.personalidade.length > 0;
      case 6: return formData.nivelBiblico !== '';
      case 7: return formData.contexto.length >= 10;
      case 8: return true; // desafio opcional
      case 9: return formData.passagem.length >= 5;
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (canProceed()) {
      onGenerate();
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <SectionHeader title="Guia para Pais" description="Crie um guia personalizado para ensinar a Bíblia ao seu filho" className="mb-8" />

      <StepProgress current={currentStep} total={totalSteps} />

      {/* Form Steps */}
      <Card className="glass p-4 sm:p-8 neon-glow overflow-hidden w-full max-w-full">
        <div className="space-y-6">
          {/* Step 1: Nome */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <SectionHeader title="Como você chama seu filho(a)?" className="mb-0" />
              <Input
                placeholder="Digite o nome ou apelido"
                value={formData.nome}
                onChange={(e) => updateFormData('nome', e.target.value)}
                className=""
              />
            </div>
          )}

          {/* Step 2: Sexo */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <SectionHeader title="Sexo da criança" className="mb-0" />
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={cn(
                    "p-3 cursor-pointer transition-all",
                    formData.sexo === 'masculino' && "border-primary border-2 bg-primary/10",
                    formData.sexo && formData.sexo !== 'masculino' && "opacity-70"
                  )}
                  onClick={() => updateFormData('sexo', 'masculino')}
                >
                  <div className="text-center">
                    <img src={meninoImg} alt="" width={816} height={816} loading="lazy" className="mx-auto h-28 w-28 object-contain" />
                    <div className="mt-1 text-sm font-semibold">Menino</div>
                  </div>
                </Card>
                <Card
                  className={cn(
                    "p-3 cursor-pointer transition-all",
                    formData.sexo === 'feminino' && "border-primary border-2 bg-primary/10",
                    formData.sexo && formData.sexo !== 'feminino' && "opacity-70"
                  )}
                  onClick={() => updateFormData('sexo', 'feminino')}
                >
                  <div className="text-center">
                    <img src={meninaImg} alt="" width={816} height={816} loading="lazy" className="mx-auto h-28 w-28 object-contain" />
                    <div className="mt-1 text-sm font-semibold">Menina</div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Step 3: Idade */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <SectionHeader title={`Quantos anos ${formData.nome} tem?`} className="mb-0" />
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-6">
                  {formData.idade} anos
                </div>
                <Slider
                  value={[formData.idade]}
                  onValueChange={(value) => updateFormData('idade', value[0])}
                  min={1}
                  max={17}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>1 ano</span>
                  <span>17 anos</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Comportamento */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <SectionHeader title={`Como você descreveria o comportamento de ${formData.nome}?`} className="mb-0" />
              <p className="text-sm text-muted-foreground">
                Selecione uma ou mais opções
              </p>
              <TraitCarousel options={comportamentoOptions} selected={formData.comportamento} onToggle={(o) => toggleArrayItem('comportamento', o)} />
            </div>
          )}

          {/* Step 5: Personalidade */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <SectionHeader title={`Qual a personalidade de ${formData.nome}?`} className="mb-0" />
              <p className="text-sm text-muted-foreground">
                Selecione uma ou mais características
              </p>
              <TraitCarousel options={personalidadeOptions} selected={formData.personalidade} onToggle={(o) => toggleArrayItem('personalidade', o)} />
            </div>
          )}

          {/* Step 6: Nível Bíblico */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-fade-in">
              <SectionHeader title="Qual o nível de conhecimento bíblico?" className="mb-0" />
              <div className="space-y-3">
                {[
                  { value: 'iniciante', label: 'Iniciante', desc: 'Primeira vez ou pouco contato com a Bíblia' },
                  { value: 'intermediario', label: 'Intermediário', desc: 'Conhece histórias básicas' },
                  { value: 'avancado', label: 'Avançado', desc: 'Já lê e entende passagens sozinho' }
                ].map((nivel) => (
                  <Card
                    key={nivel.value}
                    className={cn(
                      "p-4 cursor-pointer transition-all",
                      formData.nivelBiblico === nivel.value && "border-primary border-2 bg-primary/10"
                    )}
                    onClick={() => updateFormData('nivelBiblico', nivel.value)}
                  >
                    <div className="font-medium text-base">{nivel.label}</div>
                    <div className="text-sm text-muted-foreground">{nivel.desc}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Contexto */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-fade-in">
              <SectionHeader title="Onde e quando você planeja ensinar?" className="mb-0" />
              <div className="overflow-hidden w-full">
                <Textarea
                  placeholder="Ex: Antes de dormir, no domingo após o almoço, durante o culto familiar..."
                  value={formData.contexto}
                  onChange={(e) => updateFormData('contexto', e.target.value)}
                  className="min-h-[120px] w-full max-w-full box-border text-base md:text-sm"
                  maxLength={200}
                />
              </div>
              <div className="text-sm text-muted-foreground text-right">
                {formData.contexto.length}/200
              </div>
            </div>
          )}

          {/* Step 8: Desafio */}
          {currentStep === 8 && (
            <div className="space-y-4 animate-fade-in">
              <SectionHeader title="Há algum desafio específico? (Opcional)" className="mb-0" />
              <div className="overflow-hidden w-full">
                <Textarea
                  placeholder="Ex: Medo do escuro, dificuldade em obedecer, ansiedade..."
                  value={formData.desafio}
                  onChange={(e) => updateFormData('desafio', e.target.value)}
                  className="min-h-[120px] w-full max-w-full box-border text-base md:text-sm"
                  maxLength={150}
                />
              </div>
              <div className="text-sm text-muted-foreground text-right">
                {formData.desafio.length}/150
              </div>
            </div>
          )}

          {/* Step 9: Passagem */}
          {currentStep === 9 && (
            <div className="space-y-4 animate-fade-in">
              <SectionHeader title="Qual passagem bíblica você quer ensinar?" className="mb-0" />
              <div className="overflow-hidden w-full">
                <Textarea
                  placeholder="Ex: João 3:16, Parábola do Bom Samaritano, Moisés e o Mar Vermelho..."
                  value={formData.passagem}
                  onChange={(e) => updateFormData('passagem', e.target.value)}
                  className="min-h-[120px] w-full max-w-full box-border text-base md:text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {currentStep > 1 && (
            <ArrowNavButton direction="left" label="Voltar" onClick={handleBack} disabled={isGenerating} className="sm:flex-1" />
          )}
          
          {currentStep < totalSteps ? (
            <ArrowNavButton direction="right" label="Próximo" onClick={handleNext} disabled={!canProceed() || isGenerating} className="sm:flex-1" />
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isGenerating}
              className="w-full sm:flex-1"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">Gerando Guia...</span>
                  <span className="sm:hidden">Gerando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Gerar Guia Personalizado</span>
                  <span className="sm:hidden">Gerar Guia</span>
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
