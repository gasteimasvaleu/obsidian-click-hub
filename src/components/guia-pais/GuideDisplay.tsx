import { SPLIT_BAR } from "@/components/ui/bubble-section";
import { stripEmoji } from "@/lib/stripEmoji";
import { Guide, FormData } from "@/pages/GuiaPais";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { BubbleTitleText } from "@/components/ui/bubble-title-text";
import { cn } from "@/lib/utils";

const TRIGGER = "neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl px-4 py-3 text-feature-foreground hover:no-underline gap-3";
const CONTENT = "glass feature-bubble relative z-[1] -mt-3 rounded-2xl rounded-t-none px-4 pb-4 pt-6 text-foreground";

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
      <SectionHeader
        title="Seu Guia Personalizado"
        description={`Para ensinar ${formData.nome} sobre: ${formData.passagem}`}
        className="mb-0"
      />
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-11 border-primary/40 text-primary" onClick={handlePrint}>Imprimir</Button>
        <Button className="h-11" onClick={onNewGuide}>Novo Guia</Button>
      </div>

      <SectionHeader title={`Perfil de ${formData.nome}`} description={guide.perfil_crianca} className="mb-0" />

      {/* Seções Expandíveis */}
      <Accordion type="multiple" defaultValue={["contexto", "objetivos"]} className="space-y-4">
        {/* Contexto da Passagem */}
        <AccordionItem value="contexto" className="border-0">
          <AccordionTrigger className={TRIGGER}>
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative text-left"><BubbleTitleText text="Contexto da Passagem" /></h2>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-6 pt-0">
<div className={cn(CONTENT)}>
            <p className="text-muted-foreground leading-relaxed">{guide.contexto_passagem}</p>
          </div>
</AccordionContent>
        </AccordionItem>

        {/* Objetivos */}
        <AccordionItem value="objetivos" className="border-0">
          <AccordionTrigger className={TRIGGER}>
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative text-left"><BubbleTitleText text="Objetivos de Aprendizagem" /></h2>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-6 pt-0">
<div className={cn(CONTENT)}>
            <ul className="space-y-2">
              {guide.objetivos.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-1">{idx + 1}</Badge>
                  <span className="text-muted-foreground">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
</AccordionContent>
        </AccordionItem>

        {/* Roteiro de Conversa */}
        <AccordionItem value="roteiro" className="border-0">
          <AccordionTrigger className={TRIGGER}>
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative text-left"><BubbleTitleText text="Roteiro de Conversa Passo a Passo" /></h2>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-6 pt-0">
<div className={cn(CONTENT)}>
            <div className="space-y-4">
              {guide.roteiro_conversa.map((passo) => (
                <Card key={passo.passo} className="rounded-2xl border-primary/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="break-words">Passo {passo.passo}: {stripEmoji(passo.titulo)}</span>
                      <Badge variant="secondary" className="shrink-0 w-fit">{passo.tempo_estimado}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{stripEmoji(passo.descricao)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
</AccordionContent>
        </AccordionItem>

        {/* Atividades Práticas */}
        <AccordionItem value="atividades" className="border-0">
          <AccordionTrigger className={TRIGGER}>
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative text-left"><BubbleTitleText text="Atividades Práticas" /></h2>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-6 pt-0">
<div className={cn(CONTENT)}>
            <div className="space-y-4">
              {guide.atividades_praticas.map((atividade, idx) => (
                <Card key={idx} className="rounded-2xl border-primary/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="break-words">{stripEmoji(atividade.titulo)}</span>
                      <Badge variant="secondary" className="shrink-0 w-fit">{atividade.duracao}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stripEmoji(atividade.descricao)}</p>
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
          </div>
</AccordionContent>
        </AccordionItem>

        {/* Frases Prontas */}
        <AccordionItem value="frases" className="border-0">
          <AccordionTrigger className={TRIGGER}>
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative text-left"><BubbleTitleText text="Frases e Respostas Prontas" /></h2>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-6 pt-0">
<div className={cn(CONTENT)}>
            <Tabs defaultValue="iniciar" className="w-full">
              <TabsList className={`${SPLIT_BAR} !h-auto p-0`}>
                <TabsTrigger value="iniciar" className="h-11 flex-1 min-w-0 rounded-none px-2 text-xs sm:text-sm text-muted-foreground shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-none"><span className="truncate">Para Iniciar</span></TabsTrigger>
                <TabsTrigger value="explicar" className="h-11 flex-1 min-w-0 rounded-none px-2 text-xs sm:text-sm text-muted-foreground shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-none"><span className="truncate">Para Explicar</span></TabsTrigger>
                <TabsTrigger value="perguntas" className="h-11 flex-1 min-w-0 rounded-none px-2 text-xs sm:text-sm text-muted-foreground shadow-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-none"><span className="truncate">Perguntas</span></TabsTrigger>
              </TabsList>
              <TabsContent value="iniciar" className="space-y-2 mt-4">
                {guide.frases_prontas.iniciar.map((frase, idx) => (
                  <Card key={idx} className="p-3 rounded-2xl border-primary/30">
                    <p className="text-sm text-muted-foreground">"{frase}"</p>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="explicar" className="space-y-2 mt-4">
                {guide.frases_prontas.explicar.map((frase, idx) => (
                  <Card key={idx} className="p-3 rounded-2xl border-primary/30">
                    <p className="text-sm text-muted-foreground">"{frase}"</p>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="perguntas" className="space-y-2 mt-4">
                {guide.frases_prontas.perguntas.map((frase, idx) => (
                  <Card key={idx} className="p-3 rounded-2xl border-primary/30">
                    <p className="text-sm text-muted-foreground">"{frase}"</p>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
</AccordionContent>
        </AccordionItem>

        {/* Desafios e Soluções */}
        <AccordionItem value="desafios" className="border-0">
          <AccordionTrigger className={TRIGGER}>
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative text-left"><BubbleTitleText text="Possíveis Desafios e Soluções" /></h2>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-6 pt-0">
<div className={cn(CONTENT)}>
            <div className="space-y-3">
              {guide.desafios_solucoes.map((item, idx) => (
                <Card key={idx} className="rounded-2xl border-primary/30">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-foreground mb-2">{stripEmoji(item.desafio)}
                    </p>
                    <p className="text-sm text-muted-foreground">{stripEmoji(item.solucao)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
</AccordionContent>
        </AccordionItem>

        {/* Plano de Reforço */}
        <AccordionItem value="reforco" className="border-0">
          <AccordionTrigger className={TRIGGER}>
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative text-left"><BubbleTitleText text="Plano de Reforço" /></h2>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-6 pt-0">
<div className={cn(CONTENT, "space-y-4")}>
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
          </div>
</AccordionContent>
        </AccordionItem>

        {/* Recursos Extras */}
        <AccordionItem value="recursos" className="border-0">
          <AccordionTrigger className={TRIGGER}>
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative text-left"><BubbleTitleText text="Recursos Extras" /></h2>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-6 pt-0">
<div className={cn(CONTENT)}>
            <div className="space-y-3">
              {guide.recursos_extras.map((recurso, idx) => (
                <Card key={idx} className="rounded-2xl border-primary/30">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary">{recurso.tipo}</Badge>
                      <div>
                        <p className="font-medium text-foreground">{stripEmoji(recurso.titulo)}</p>
                        <p className="text-sm text-muted-foreground mt-1">{stripEmoji(recurso.descricao)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
</AccordionContent>
        </AccordionItem>

        {/* Dicas Personalizadas */}
        <AccordionItem value="dicas" className="border-0">
          <AccordionTrigger className={TRIGGER}>
            <span aria-hidden className="border-beam" />
            <h2 className="bubble-title relative text-left"><BubbleTitleText text="Dicas Personalizadas" /></h2>
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-6 pt-0">
<div className={cn(CONTENT)}>
            <div className="space-y-2">
              {guide.dicas_personalizadas.map((dica, idx) => (
                <Card key={idx} className="p-3 rounded-2xl border-primary/30">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    {dica}
                  </p>
                </Card>
              ))}
            </div>
          </div>
</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
