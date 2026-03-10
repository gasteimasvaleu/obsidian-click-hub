import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CreditCard, RefreshCw, XCircle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermosDeUso = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: FileText,
      title: "Descrição do Serviço",
      text: "O BíbliaToon Club é uma plataforma educativa cristã para crianças e famílias, oferecendo conteúdo interativo incluindo Bíblia infantil, devocionais, jogos, músicas, atividades de colorir e cursos. O acesso ao conteúdo completo requer uma assinatura ativa.",
    },
    {
      icon: CreditCard,
      title: "Assinatura e Pagamento",
      text: "A assinatura \"BíbliaToon KIDS Premium\" é mensal com renovação automática. O pagamento será cobrado na sua conta do iTunes/App Store no momento da confirmação da compra. O valor da assinatura é exibido na tela de compra antes da confirmação.",
    },
    {
      icon: RefreshCw,
      title: "Renovação Automática",
      text: "A assinatura é renovada automaticamente ao final de cada período mensal, a menos que a renovação automática seja desativada pelo menos 24 horas antes do fim do período atual. A conta será cobrada pela renovação dentro de 24 horas antes do fim do período vigente.",
    },
    {
      icon: XCircle,
      title: "Cancelamento",
      text: "Você pode cancelar a renovação automática a qualquer momento através das configurações da sua conta na App Store (Ajustes > Apple ID > Assinaturas). O cancelamento entra em vigor ao final do período de cobrança atual. Não há reembolso para períodos parciais.",
    },
    {
      icon: Mail,
      title: "Contato e Suporte",
      text: "Para dúvidas, problemas técnicos ou solicitações relacionadas à assinatura, entre em contato pelo e-mail suporte@bibliatoonkids.com.br. Nos comprometemos a responder em até 48 horas úteis.",
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
            <FileText className="h-12 w-12 text-primary mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Termos de Uso (EULA)
            </h1>
            <p className="text-muted-foreground text-sm">
              Termos e condições de uso do aplicativo BíbliaToon KIDS.
            </p>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ao utilizar o aplicativo BíbliaToon KIDS, você concorda com os termos descritos abaixo. 
              Estes termos constituem um acordo legal entre você e a BíbliaToon KIDS. 
              Caso não concorde com algum dos termos, não utilize o aplicativo.
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

          <GlassCard className="p-5">
            <h2 className="text-foreground font-semibold text-base mb-2">Uso Aceitável</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              O conteúdo do aplicativo é protegido por direitos autorais e destinado exclusivamente ao uso pessoal e familiar. 
              É proibida a reprodução, distribuição ou modificação do conteúdo sem autorização prévia por escrito.
            </p>
          </GlassCard>

          <GlassCard className="p-5">
            <h2 className="text-foreground font-semibold text-base mb-2">Alterações nos Termos</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Reservamo-nos o direito de alterar estes termos a qualquer momento. 
              Alterações significativas serão comunicadas dentro do aplicativo. 
              O uso continuado após alterações constitui aceitação dos novos termos.
            </p>
          </GlassCard>

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

export default TermosDeUso;
