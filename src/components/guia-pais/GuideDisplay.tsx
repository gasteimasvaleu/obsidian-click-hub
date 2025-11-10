import { Guide, FormData } from "@/pages/GuiaPais";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, BookOpen, Target, MessageCircle, Palette, 
  Lightbulb, AlertTriangle, Calendar, BookMarked, Sparkles,
  FileText, RotateCcw
} from "lucide-react";

interface GuideDisplayProps {
  guide: Guide;
  formData: FormData;
  onNewGuide: () => void;
}

export const GuideDisplay = ({ guide, formData, onNewGuide }: GuideDisplayProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary animate-glow">
          Seu Guia Personalizado
        </h1>
        <p className="text-muted-foreground">
          Para ensinar {formData.nome} sobre: {formData.passagem}
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handlePrint}>
            <FileText className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={onNewGuide}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Novo Guia
          </Button>
        </div>
      </div>

      {/* Perfil da Criança - Sempre Aberto */}
      <Card className="glass neon-glow border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Perfil de {formData.nome}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{guide.perfil_crianca}</p>
        </CardContent>
      </Card>

      {/* Seções Expandíveis */}
      <Accordion type="multiple" defaultValue={["contexto", "objetivos"]} className="space-y-4">
        {/* Contexto da Passagem */}
        <AccordionItem value="contexto" className="glass neon-glow border-0 rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">Contexto da Passagem</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <p className="text-muted-foreground leading-relaxed">{guide.contexto_passagem}</p>
          </AccordionContent>
        </AccordionItem>

        {/* Objetivos */}
        <AccordionItem value="objetivos" className="glass neon-glow border-0 rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">Objetivos de Aprendizagem</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <ul className="space-y-2">
              {guide.objetivos.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-1">{idx + 1}</Badge>
                  <span className="text-muted-foreground">{obj}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Roteiro de Conversa */}
        <AccordionItem value="roteiro" className="glass neon-glow border-0 rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">Roteiro de Conversa Passo a Passo</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              {guide.roteiro_conversa.map((passo) => (
                <Card key={passo.passo} className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>Passo {passo.passo}: {passo.titulo}</span>
                      <Badge variant="secondary">{passo.tempo_estimado}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{passo.descricao}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Atividades Práticas */}
        <AccordionItem value="atividades" className="glass neon-glow border-0 rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">Atividades Práticas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              {guide.atividades_praticas.map((atividade, idx) => (
                <Card key={idx} className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{atividade.titulo}</span>
                      <Badge variant="secondary">{atividade.duracao}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{atividade.descricao}</p>
                    <div>
                      <p className="text-sm font-medium mb-1">Materiais:</p>
                      <div className="flex flex-wrap gap-1">
                        {atividade.materiais.map((material, mIdx) => (
                          <Badge key={mIdx} variant="outline">{material}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Frases Prontas */}
        <AccordionItem value="frases" className="glass neon-glow border-0 rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">Frases e Respostas Prontas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <Tabs defaultValue="iniciar" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="iniciar">Para Iniciar</TabsTrigger>
                <TabsTrigger value="explicar">Para Explicar</TabsTrigger>
                <TabsTrigger value="perguntas">Perguntas</TabsTrigger>
              </TabsList>
              <TabsContent value="iniciar" className="space-y-2 mt-4">
                {guide.frases_prontas.iniciar.map((frase, idx) => (
                  <Card key={idx} className="p-3 border-border/50">
                    <p className="text-sm text-muted-foreground">"{frase}"</p>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="explicar" className="space-y-2 mt-4">
                {guide.frases_prontas.explicar.map((frase, idx) => (
                  <Card key={idx} className="p-3 border-border/50">
                    <p className="text-sm text-muted-foreground">"{frase}"</p>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="perguntas" className="space-y-2 mt-4">
                {guide.frases_prontas.perguntas.map((frase, idx) => (
                  <Card key={idx} className="p-3 border-border/50">
                    <p className="text-sm text-muted-foreground">"{frase}"</p>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>

        {/* Desafios e Soluções */}
        <AccordionItem value="desafios" className="glass neon-glow border-0 rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">Possíveis Desafios e Soluções</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-3">
              {guide.desafios_solucoes.map((item, idx) => (
                <Card key={idx} className="border-border/50">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-foreground mb-2">
                      ⚠️ {item.desafio}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      💡 {item.solucao}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Plano de Reforço */}
        <AccordionItem value="reforco" className="glass neon-glow border-0 rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">Plano de Reforço</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Primeira Semana:</h4>
              <ul className="space-y-1">
                {guide.plano_reforco.primeira_semana.map((item, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Próximos Dias:</h4>
              <ul className="space-y-1">
                {guide.plano_reforco.proximos_dias.map((item, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Recursos Extras */}
        <AccordionItem value="recursos" className="glass neon-glow border-0 rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">Recursos Extras</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-3">
              {guide.recursos_extras.map((recurso, idx) => (
                <Card key={idx} className="border-border/50">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary">{recurso.tipo}</Badge>
                      <div>
                        <p className="font-medium text-foreground">{recurso.titulo}</p>
                        <p className="text-sm text-muted-foreground mt-1">{recurso.descricao}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Dicas Personalizadas */}
        <AccordionItem value="dicas" className="glass neon-glow border-0 rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">Dicas Personalizadas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-2">
              {guide.dicas_personalizadas.map((dica, idx) => (
                <Card key={idx} className="p-3 border-border/50">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">✨</span>
                    {dica}
                  </p>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
