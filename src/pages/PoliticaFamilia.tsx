import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Baby, Eye, Lock, BellOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PoliticaFamilia = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Baby,
      title: "Conteúdo para Crianças",
      text: "Todo o conteúdo do Bíblia Toon Kids é desenvolvido especialmente para crianças, com linguagem acessível e temas bíblicos apropriados para todas as idades. Não há conteúdo violento, assustador ou inapropriado.",
    },
    {
      icon: Lock,
      title: "Privacidade e Dados",
      text: "Não coletamos dados pessoais de crianças. As informações de conta (e-mail e nome) são fornecidas pelos pais ou responsáveis no momento do cadastro. Nenhum dado é compartilhado com terceiros.",
    },
    {
      icon: BellOff,
      title: "Sem Anúncios",
      text: "O aplicativo não exibe nenhum tipo de publicidade ou anúncio. Todo o conteúdo é acessado exclusivamente pela assinatura, garantindo uma experiência segura e livre de distrações.",
    },
    {
      icon: Eye,
      title: "Supervisão dos Pais",
      text: "Recomendamos que os pais ou responsáveis acompanhem o uso do aplicativo. Funcionalidades como o \"Amigo Divino\" (chat com IA) possuem portal de consentimento parental para garantir a segurança da criança.",
    },
    {
      icon: ShieldCheck,
      title: "Conformidade com Políticas",
      text: "O Bíblia Toon Kids está em conformidade com a Política de Famílias do Google Play e as Diretrizes de Revisão da App Store, incluindo COPPA (Children's Online Privacy Protection Act) e diretrizes de proteção de dados infantis.",
    },
  ];

  return (
    <div className="min-h-screen bg-black relative flex flex-col pb-36">
      <FuturisticNavbar />

      <div className="flex-1 px-4 pt-20 pb-8">
        <div className="w-full max-w-2xl mx-auto space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <GlassCard className="p-6 text-center">
            <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Política de Famílias e Privacidade
            </h1>
            <p className="text-muted-foreground text-sm">
              Conheça como o Bíblia Toon Kids protege as crianças e garante um ambiente seguro.
            </p>
          </GlassCard>

          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <GlassCard key={i} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 min-w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-foreground font-semibold text-base mb-1">{section.title}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">{section.text}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}

          <GlassCard className="p-5 text-center">
            <p className="text-muted-foreground text-xs">
              Última atualização: Março de 2026
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Em caso de dúvidas, entre em contato: suporte@bibliatoonkids.com.br
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default PoliticaFamilia;
