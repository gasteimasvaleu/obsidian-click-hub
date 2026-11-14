import { motion } from "framer-motion";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { useNavigate } from "react-router-dom";
import { BubbleSection } from "@/components/ui/bubble-section";
import { SectionHeader } from "@/components/plataforma/CourseCarousel";
import { ArrowNavButton } from "@/components/plataforma/BackArrowButton";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const purposeItems = [
  {
    title: "Encantam",
    description: "com animações 3D estilo Disney Pixar, personagens expressivos, cenários mágicos e histórias envolventes."
  },
  {
    title: "Educam",
    description: "com passagens bíblicas explicadas de forma acessível, atividades práticas, quizzes, jogos e clipes musicais."
  },
  {
    title: "Transformam",
    description: "com mensagens que impactam o coração, reforçam a fé e ajudam as crianças a desenvolverem caráter e bons modos."
  }
];

const features = [
  {
    title: "Histórias Bíblicas",
    description: "Módulos de histórias bíblicas como Adão e Eva, Noé, Moisés, José, entre outros — apresentados de forma animada, interativa e colorida."
  },
  {
    title: "Heróis de Animes",
    description: "Conteúdo temático com heróis de animes que ensinam valores cristãos (como os módulos Naruto ou Goku) — um formato contemporâneo para alcançar a geração digital com propósito."
  },
  {
    title: "Clipes Musicais",
    description: "Clipes musicais originais, brindando alegria, ritmo e memorização de versículos e princípios."
  },
  {
    title: "Jogos Educativos",
    description: "Jogos educativos, quizzes, caça-palavras, livros para colorir e outras atividades que reforçam o aprendizado de forma lúdica."
  },
  {
    title: "Versículos via WhatsApp",
    description: "Funcionalidades exclusivas como o envio diário de versículos via WhatsApp, trazendo inspiração e fé direto para a rotina da família."
  }
];

const differentials = [
  {
    title: "Qualidade Cinematográfica",
    description: "Animações com estilo visual profissional, textura realista em personagens, efeitos de luz, profundidade 3D e atmosfera épica."
  },
  {
    title: "Conteúdo Seguro e Cristão",
    description: "Tudo criado com base nos valores católicos, sem comprometer o entretenimento."
  },
  {
    title: "Para Crianças e Famílias",
    description: "Pensado para ser assistido juntos, favorecendo momentos de diálogo entre pais e filhos."
  },
  {
    title: "Acessível e Dinâmico",
    description: "Novos conteúdos adicionados regularmente e recursos que estimulam a continuidade do aprendizado."
  }
];

const ItemGrid = ({ items, cols }: { items: { title: string; description: string }[]; cols: string }) => (
  <div className={`grid grid-cols-1 gap-x-4 ${cols}`}>
    {items.map((item) => (
      <motion.div key={item.title} {...fadeInUp}>
        <BubbleSection title={item.title} as="h3" className="mb-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </BubbleSection>
      </motion.div>
    ))}
  </div>
);

const Sobre = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-16">
      <FuturisticNavbar />
      <div className="container mx-auto px-4 pt-20 max-w-[58rem] space-y-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <BubbleSection title="Sobre o BíbliaToon Club" as="h1" className="mb-0">
            <p className="text-base font-medium text-foreground/80">Transformando fé em aventura</p>
          </BubbleSection>
        </motion.div>

        <motion.div {...fadeInUp}>
          <BubbleSection title="Nossa História" className="mb-0">
            <p className="mb-4 leading-relaxed text-foreground/90">
              O BíbliaToon Club nasceu do desejo sincero de transformar histórias bíblicas em experiências envolventes para crianças — e incentivar pais e educadores a utilizarem a fé como ferramenta de formação. Fundado por uma equipe de animadores, educadores cristãos e desenvolvedores apaixonados pela infância, o projeto começou com uma simples pergunta: <span className="font-semibold text-primary">"E se os heróis das Escrituras falassem a linguagem da geração digital?"</span>
            </p>
            <p className="leading-relaxed text-foreground/90">
              Desde então, a plataforma evoluiu e cresceu, conectando fé, criatividade e tecnologia de forma única.
            </p>
          </BubbleSection>
        </motion.div>

        <section>
          <motion.div {...fadeInUp}>
            <BubbleSection title="Nosso Propósito" className="mb-4">
              <p className="mb-4 leading-relaxed text-foreground/90">
                Nossa missão é levar a Palavra de Deus ao universo das crianças de maneira clara, divertida e educativa. Acreditamos que valores como amor, respeito, gratidão, perdão e obediência são sementes que devem ser plantadas cedo — e que aprender brincando faz toda a diferença.
              </p>
              <p className="leading-relaxed text-foreground/90">Por isso, criamos conteúdos que:</p>
            </BubbleSection>
          </motion.div>
          <ItemGrid items={purposeItems} cols="md:grid-cols-3" />
        </section>

        <section>
          <SectionHeader title="O que você encontra" description="Tudo o que o BíbliaToon Club oferece para sua família" />
          <ItemGrid items={features} cols="md:grid-cols-2" />
        </section>

        <section>
          <SectionHeader title="Diferenciais da Plataforma" description="Por que as famílias escolhem o BíbliaToon Club" />
          <ItemGrid items={differentials} cols="md:grid-cols-2" />
        </section>

        <motion.div {...fadeInUp}>
          <BubbleSection title="Nosso Compromisso" className="mb-0">
            <p className="mb-4 leading-relaxed text-foreground/90">
              Nos comprometemos a entregar uma experiência que respeita a infância e a fé. Queremos que os pequenos se encantem pela beleza da Bíblia, se sintam conectados com os personagens e criem uma rotina saudável de fé e valores.
            </p>
            <p className="leading-relaxed text-foreground/90">
              A cada novo módulo, a cada canção, a cada quiz, buscamos inspirar crianças a serem <span className="font-semibold text-primary">verdadeiros heróis do bem</span>, cheios de luz e compaixão.
            </p>
          </BubbleSection>
        </motion.div>

        <motion.div {...fadeInUp}>
          <BubbleSection title="Junte-se a nós" className="mb-0">
            <p className="mb-5 leading-relaxed text-foreground/90">
              Venha fazer parte da família BíbliaToon Club! Explore o conteúdo, interaja com a comunidade e transforme o aprendizado da fé em uma aventura inesquecível. O futuro dos nossos pequenos começa com sementes de valores — e estamos prontos para plantar juntos.
            </p>
            <ArrowNavButton direction="right" label="Começar Agora" onClick={() => navigate('/login')} className="w-full" />
          </BubbleSection>
        </motion.div>
      </div>
    </div>
  );
};

export default Sobre;
