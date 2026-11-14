import type { ReactNode } from "react";
import { ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { BubbleSection } from "@/components/ui/bubble-section";
import { useNavigate } from "react-router-dom";

const EMAIL = "suporte@bibliatoonkids.com.br";
const Mail = () => (
  <a href={`mailto:${EMAIL}`} className="font-semibold text-primary underline-offset-2 hover:underline">{EMAIL}</a>
);
const withEmail = (text: string): ReactNode => {
  const parts = text.split(EMAIL);
  return parts.length === 1 ? text : <>{parts[0]}<Mail />{parts.slice(1).join(EMAIL)}</>;
};

const TermosDeUso = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Descrição do Serviço",
      text: "O BíbliaToon Club é uma plataforma educativa cristã para crianças e famílias, oferecendo conteúdo interativo incluindo Bíblia infantil, devocionais, jogos, músicas, atividades de colorir e cursos. O acesso ao conteúdo completo requer uma assinatura ativa.",
    },
    {
      title: "Assinatura e Pagamento",
      text: "A assinatura \"BíbliaToon Club Premium\" é mensal com renovação automática. O pagamento será cobrado na sua conta do iTunes/App Store no momento da confirmação da compra. O valor da assinatura é exibido na tela de compra antes da confirmação.",
    },
    {
      title: "Renovação Automática",
      text: "A assinatura é renovada automaticamente ao final de cada período mensal, a menos que a renovação automática seja desativada pelo menos 24 horas antes do fim do período atual. A conta será cobrada pela renovação dentro de 24 horas antes do fim do período vigente.",
    },
    {
      title: "Cancelamento",
      text: "Você pode cancelar a renovação automática a qualquer momento através das configurações da sua conta na App Store (Ajustes > Apple ID > Assinaturas). O cancelamento entra em vigor ao final do período de cobrança atual. Não há reembolso para períodos parciais.",
    },
    {
      title: "Contato e Suporte",
      text: "Para dúvidas, problemas técnicos ou solicitações relacionadas à assinatura, entre em contato pelo e-mail suporte@bibliatoonkids.com.br. Nos comprometemos a responder em até 48 horas úteis.",
    },
    {
      title: "Uso Aceitável",
      text: "O conteúdo do aplicativo é protegido por direitos autorais e destinado exclusivamente ao uso pessoal e familiar. É proibida a reprodução, distribuição ou modificação do conteúdo sem autorização prévia por escrito.",
    },
    {
      title: "Alterações nos Termos",
      text: "Reservamo-nos o direito de alterar estes termos a qualquer momento. Alterações significativas serão comunicadas dentro do aplicativo. O uso continuado após alterações constitui aceitação dos novos termos.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-36">
      <FuturisticNavbar />
      <div className="container mx-auto px-4 pt-20 max-w-[58rem]">
        <ArrowNavButton direction="left" label="Voltar" onClick={() => navigate(-1)} className="mb-6" />

        <BubbleSection title="Termos de Uso (EULA)" as="h1" cardClassName="space-y-3">
          <p className="text-sm font-medium text-foreground/80">Termos e condições de uso do aplicativo BíbliaToon Club.</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Ao utilizar o aplicativo BíbliaToon Club, você concorda com os termos descritos abaixo. Estes termos constituem um acordo legal entre você e a BíbliaToon Club. Caso não concorde com algum dos termos, não utilize o aplicativo.
          </p>
        </BubbleSection>

        {sections.map((section) => (
          <BubbleSection key={section.title} title={section.title}>
            <p className="text-sm leading-relaxed text-muted-foreground">{withEmail(section.text)}</p>
          </BubbleSection>
        ))}

        <div className="mt-2 text-center text-xs text-muted-foreground">
          <p>Última atualização: Março de 2026</p>
          <p className="mt-1">Em caso de dúvidas, entre em contato: <Mail /></p>
        </div>
      </div>
    </div>
  );
};

export default TermosDeUso;
