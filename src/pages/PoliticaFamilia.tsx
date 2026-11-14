import { ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { BubbleSection } from "@/components/ui/bubble-section";
import { useNavigate } from "react-router-dom";

const PoliticaFamilia = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Conteúdo para Crianças",
      text: "Todo o conteúdo do BíbliaToon Club é desenvolvido especialmente para crianças, com linguagem acessível e temas bíblicos apropriados para todas as idades. Não há conteúdo violento, assustador ou inapropriado.",
    },
    {
      title: "Privacidade e Dados",
      text: "Não coletamos dados pessoais de crianças. As informações de conta (e-mail e nome) são fornecidas pelos pais ou responsáveis no momento do cadastro. Nenhum dado é compartilhado com terceiros.",
    },
    {
      title: "Sem Anúncios",
      text: "O aplicativo não exibe nenhum tipo de publicidade ou anúncio. Todo o conteúdo é acessado exclusivamente pela assinatura, garantindo uma experiência segura e livre de distrações.",
    },
    {
      title: "Supervisão dos Pais",
      text: "Recomendamos que os pais ou responsáveis acompanhem o uso do aplicativo. Funcionalidades como o \"Amigo Divino\" (chat com IA) possuem portal de consentimento parental para garantir a segurança da criança.",
    },
    {
      title: "Conformidade com Políticas",
      text: "O BíbliaToon Club está em conformidade com a Política de Famílias do Google Play e as Diretrizes de Revisão da App Store, incluindo COPPA (Children's Online Privacy Protection Act) e diretrizes de proteção de dados infantis.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-36">
      <FuturisticNavbar />
      <div className="container mx-auto px-4 pt-20 max-w-[58rem]">
        <ArrowNavButton direction="left" label="Voltar" onClick={() => navigate(-1)} className="mb-6" />

        <BubbleSection title="Política de Famílias e Privacidade" as="h1">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Conheça como o BíbliaToon Club protege as crianças e garante um ambiente seguro.
          </p>
        </BubbleSection>

        {sections.map((section) => (
          <BubbleSection key={section.title} title={section.title}>
            <p className="text-sm leading-relaxed text-muted-foreground">{section.text}</p>
          </BubbleSection>
        ))}

        <div className="mt-2 text-center text-xs text-muted-foreground">
          <p>Última atualização: Março de 2026</p>
          <p className="mt-1">
            Em caso de dúvidas, entre em contato:{" "}
            <a href="mailto:suporte@bibliatoonkids.com.br" className="font-semibold text-primary underline-offset-2 hover:underline">
              suporte@bibliatoonkids.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PoliticaFamilia;
