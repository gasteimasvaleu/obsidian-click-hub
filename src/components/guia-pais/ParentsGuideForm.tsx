import { useState } from "react";
import { FormData } from "@/pages/GuiaPais";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParentsGuideFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const comportamentoOptions = [
  "Agitado", "Tímido", "Curioso", "Questionador", 
  "Obediente", "Desafiador", "Sensível"
];

const personalidadeOptions = [
  "Extrovertido", "Introvertido", "Criativo", "Lógico",
  "Emocional", "Racional", "Competitivo", "Colaborativo"
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
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4 animate-glow">
          Guia para Pais
        </h1>
        <p className="text-muted-foreground">
          Crie um guia personalizado para ensinar a Bíblia ao seu filho
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Passo {currentStep} de {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Form Steps */}
      <Card className="glass p-8 neon-glow">
        <div className="space-y-6">
          {/* Step 1: Nome */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-semibold text-foreground">
                Como você chama seu filho(a)?
              </h2>
              <Input
                placeholder="Digite o nome ou apelido"
                value={formData.nome}
                onChange={(e) => updateFormData('nome', e.target.value)}
                className="text-lg"
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Sexo */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-semibold text-foreground">
                Sexo da criança
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={cn(
                    "p-6 cursor-pointer transition-all hover:scale-105",
                    formData.sexo === 'masculino' && "border-primary border-2 bg-primary/10"
                  )}
                  onClick={() => updateFormData('sexo', 'masculino')}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">👦</div>
                    <div className="font-medium">Menino</div>
                  </div>
                </Card>
                <Card
                  className={cn(
                    "p-6 cursor-pointer transition-all hover:scale-105",
                    formData.sexo === 'feminino' && "border-primary border-2 bg-primary/10"
                  )}
                  onClick={() => updateFormData('sexo', 'feminino')}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">👧</div>
                    <div className="font-medium">Menina</div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Step 3: Idade */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-semibold text-foreground">
                Quantos anos {formData.nome} tem?
              </h2>
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-6">
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
              <h2 className="text-2xl font-semibold text-foreground">
                Como você descreveria o comportamento de {formData.nome}?
              </h2>
              <p className="text-sm text-muted-foreground">
                Selecione uma ou mais opções
              </p>
              <div className="flex flex-wrap gap-2">
                {comportamentoOptions.map((option) => (
                  <Badge
                    key={option}
                    variant={formData.comportamento.includes(option) ? "default" : "outline"}
                    className="cursor-pointer text-base py-2 px-4"
                    onClick={() => toggleArrayItem('comportamento', option)}
                  >
                    {option}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Personalidade */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-semibold text-foreground">
                Qual a personalidade de {formData.nome}?
              </h2>
              <p className="text-sm text-muted-foreground">
                Selecione uma ou mais características
              </p>
              <div className="flex flex-wrap gap-2">
                {personalidadeOptions.map((option) => (
                  <Badge
                    key={option}
                    variant={formData.personalidade.includes(option) ? "default" : "outline"}
                    className="cursor-pointer text-base py-2 px-4"
                    onClick={() => toggleArrayItem('personalidade', option)}
                  >
                    {option}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Nível Bíblico */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-semibold text-foreground">
                Qual o nível de conhecimento bíblico?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'iniciante', label: 'Iniciante', desc: 'Primeira vez ou pouco contato com a Bíblia' },
                  { value: 'intermediario', label: 'Intermediário', desc: 'Conhece histórias básicas' },
                  { value: 'avancado', label: 'Avançado', desc: 'Já lê e entende passagens sozinho' }
                ].map((nivel) => (
                  <Card
                    key={nivel.value}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:scale-105",
                      formData.nivelBiblico === nivel.value && "border-primary border-2 bg-primary/10"
                    )}
                    onClick={() => updateFormData('nivelBiblico', nivel.value)}
                  >
                    <div className="font-medium text-lg">{nivel.label}</div>
                    <div className="text-sm text-muted-foreground">{nivel.desc}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Contexto */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-semibold text-foreground">
                Onde e quando você planeja ensinar?
              </h2>
              <Textarea
                placeholder="Ex: Antes de dormir, no domingo após o almoço, durante o culto familiar..."
                value={formData.contexto}
                onChange={(e) => updateFormData('contexto', e.target.value)}
                className="min-h-[120px]"
                maxLength={200}
              />
              <div className="text-sm text-muted-foreground text-right">
                {formData.contexto.length}/200
              </div>
            </div>
          )}

          {/* Step 8: Desafio */}
          {currentStep === 8 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-semibold text-foreground">
                Há algum desafio específico? (Opcional)
              </h2>
              <Textarea
                placeholder="Ex: Medo do escuro, dificuldade em obedecer, ansiedade..."
                value={formData.desafio}
                onChange={(e) => updateFormData('desafio', e.target.value)}
                className="min-h-[120px]"
                maxLength={150}
              />
              <div className="text-sm text-muted-foreground text-right">
                {formData.desafio.length}/150
              </div>
            </div>
          )}

          {/* Step 9: Passagem */}
          {currentStep === 9 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-semibold text-foreground">
                Qual passagem bíblica você quer ensinar?
              </h2>
              <Textarea
                placeholder="Ex: João 3:16, Parábola do Bom Samaritano, Moisés e o Mar Vermelho..."
                value={formData.passagem}
                onChange={(e) => updateFormData('passagem', e.target.value)}
                className="min-h-[120px]"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isGenerating}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isGenerating}
              className="flex-1"
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Gerando Guia...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Guia Personalizado
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
