import { motion } from "framer-motion";
import { 
  BookHeart, Sparkles, BookOpen, Heart,
  Book, Zap, Music, Gamepad2, MessageCircle,
  Film, Cross, Users, Rocket, HeartHandshake,
  ArrowRight
} from "lucide-react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { NeonButton } from "@/components/NeonButton";
import { GlassCard } from "@/components/GlassCard";
import { useNavigate } from "react-router-dom";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const purposeItems = [
  {
    icon: Sparkles,
    title: "Encantam",
    gradient: "from-blue-500 to-purple-500",
    description: "com animações 3D estilo Disney Pixar, personagens expressivos, cenários mágicos e histórias envolventes."
  },
  {
    icon: BookOpen,
    title: "Educam",
    gradient: "from-green-500 to-teal-500",
    description: "com passagens bíblicas explicadas de forma acessível, atividades práticas, quizzes, jogos e clipes musicais."
  },
  {
    icon: Heart,
    title: "Transformam",
    gradient: "from-pink-500 to-orange-500",
    description: "com mensagens que impactam o coração, reforçam a fé e ajudam as crianças a desenvolverem caráter e bons modos."
  }
];

const features = [
  {
    icon: Book,
    title: "Histórias Bíblicas",
    description: "Módulos de histórias bíblicas como Adão e Eva, Noé, Moisés, José, entre outros — apresentados de forma animada, interativa e colorida.",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    icon: Zap,
    title: "Heróis de Animes",
    description: "Conteúdo temático com heróis de animes que ensinam valores cristãos (como os módulos Naruto ou Goku) — um formato contemporâneo para alcançar a geração digital com propósito.",
    gradient: "from-red-500 to-pink-500"
  },
  {
    icon: Music,
    title: "Clipes Musicais",
    description: "Clipes musicais originais, brindando alegria, ritmo e memorização de versículos e princípios.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Gamepad2,
    title: "Jogos Educativos",
    description: "Jogos educativos, quizzes, caça-palavras, livros para colorir e outras atividades que reforçam o aprendizado de forma lúdica.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: MessageCircle,
    title: "Versículos via WhatsApp",
    description: "Funcionalidades exclusivas como o envio diário de versículos via WhatsApp, trazendo inspiração e fé direto para a rotina da família.",
    gradient: "from-green-400 to-cyan-500"
  }
];

const differentials = [
  {
    icon: Film,
    title: "Qualidade Cinematográfica",
    description: "Animações com estilo visual profissional, textura realista em personagens, efeitos de luz, profundidade 3D e atmosfera épica.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Cross,
    title: "Conteúdo Seguro e Cristão",
    description: "Tudo criado com base nos valores evangélicos tradicionais, sem comprometer o entretenimento.",
    gradient: "from-green-500 to-teal-500"
  },
  {
    icon: Users,
    title: "Para Crianças e Famílias",
    description: "Pensado para ser assistido juntos, favorecendo momentos de diálogo entre pais e filhos.",
    gradient: "from-orange-500 to-yellow-500"
  },
  {
    icon: Rocket,
    title: "Acessível e Dinâmico",
    description: "Assinatura mensal acessível, novos conteúdos adicionados regularmente e recursos que estimulam a continuidade do aprendizado.",
    gradient: "from-blue-500 to-cyan-500"
  }
];

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode; icon: any }) => (
  <motion.div 
    className="flex items-center justify-center gap-3 mb-8"
    {...fadeInUp}
  >
    <Icon className="w-8 h-8 text-primary" />
    <h2 className="text-3xl font-bold text-white">
      {children}
    </h2>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description, gradient }: any) => (
  <motion.div
    className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105"
    {...scaleIn}
  >
    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const Sobre = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative pb-28 md:pb-16">
      <FuturisticNavbar />
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="text-center p-8 md:p-12 border-primary/20">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                Sobre o BíbliaToonKIDS
              </h1>
              <p className="text-xl md:text-2xl text-white/80">
                Transformando fé em aventura
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Nossa História */}
        <motion.section className="mb-16 md:mb-24" {...fadeInUp}>
          <SectionTitle icon={BookHeart}>Nossa História</SectionTitle>
          <div className="glass rounded-2xl p-6 md:p-8 border border-primary/20">
            <p className="text-foreground/90 mb-4 leading-relaxed">
              O BíbliaToon KIDS nasceu do desejo sincero de transformar histórias bíblicas em experiências envolventes para crianças — e incentivar pais e educadores a utilizarem a fé como ferramenta de formação. Fundado por uma equipe de animadores, educadores cristãos e desenvolvedores apaixonados pela infância, o projeto começou com uma simples pergunta: <span className="text-primary font-semibold">"E se os heróis das Escrituras falassem a linguagem da geração digital?"</span>
            </p>
            <p className="text-foreground/90 leading-relaxed">
              Desde então, a plataforma evoluiu e cresceu, conectando fé, criatividade e tecnologia de forma única.
            </p>
          </div>
        </motion.section>

        {/* Nosso Propósito */}
        <section className="mb-16 md:mb-24">
          <SectionTitle icon={Heart}>Nosso Propósito</SectionTitle>
          <div className="glass rounded-2xl p-6 md:p-8 border border-primary/20 mb-8">
            <p className="text-foreground/90 mb-4 leading-relaxed">
              Nossa missão é levar a Palavra de Deus ao universo das crianças de maneira clara, divertida e educativa. Acreditamos que valores como amor, respeito, gratidão, perdão e obediência são sementes que devem ser plantadas cedo — e que aprender brincando faz toda a diferença.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              Por isso, criamos conteúdos que:
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {purposeItems.map((item, index) => (
              <motion.div
                key={index}
                className="glass rounded-xl p-6 border border-primary/20"
                variants={scaleIn}
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* O que você encontra */}
        <section className="mb-16 md:mb-24">
          <SectionTitle icon={Sparkles}>O que você encontra no BíbliaToon KIDS</SectionTitle>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </motion.div>
        </section>

        {/* Diferenciais da Plataforma */}
        <section className="mb-16 md:mb-24">
          <SectionTitle icon={Rocket}>Diferenciais da Plataforma</SectionTitle>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {differentials.map((differential, index) => (
              <FeatureCard key={index} {...differential} />
            ))}
          </motion.div>
        </section>

        {/* Nosso Compromisso */}
        <motion.section className="mb-16 md:mb-24" {...fadeInUp}>
          <SectionTitle icon={HeartHandshake}>Nosso Compromisso</SectionTitle>
          <div className="glass rounded-2xl p-6 md:p-8 border-2 border-primary/30 bg-black/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
            <div className="relative z-10">
              <p className="text-foreground/90 mb-4 leading-relaxed">
                Nos comprometemos a entregar uma experiência que respeita a infância e a fé. Queremos que os pequenos se encantem pela beleza da Bíblia, se sintam conectados com os personagens e criem uma rotina saudável de fé e valores.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                A cada novo módulo, a cada canção, a cada quiz, buscamos inspirar crianças a serem <span className="text-primary font-semibold">verdadeiros heróis do bem</span>, cheios de luz e compaixão.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Junte-se a nós - CTA Final */}
        <motion.section 
          className="text-center"
          {...fadeInUp}
        >
          <div className="glass rounded-2xl p-8 md:p-12 border border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent" />
            <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Junte-se a nós
          </h2>
              <p className="text-foreground/90 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
                Venha fazer parte da família BíbliaToon KIDS! Assine, explore o conteúdo, interaja com a comunidade e transforme o aprendizado da fé em uma aventura inesquecível. O futuro dos nossos pequenos começa com sementes de valores — e estamos prontos para plantar juntos.
              </p>
              <NeonButton 
                onClick={() => navigate('/login')}
                className="group"
              >
                Começar Agora
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </NeonButton>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Sobre;
