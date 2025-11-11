import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { NeonButton } from "@/components/NeonButton";
import sectionHero from "@/assets/section-hero.jpg";
import sectionMiddle from "@/assets/section-middle.jpg";
import sectionBottom from "@/assets/section-bottom.jpg";

const LandingPageSections = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <FuturisticNavbar />
      
      {/* Section 1 - Hero com fundo escuro e imagem vazando */}
      <section className="relative w-full bg-gradient-to-b from-[#1a0f2e] via-[#2d1b4e] to-[#3d2566] pt-24 pb-32 overflow-visible">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            Aventuras Bíblicas
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Descubra histórias incríveis que vão transformar a fé das crianças
          </p>
          <NeonButton onClick={() => console.log('Começar')}>
            Começar Jornada
          </NeonButton>
        </div>
        
        {/* Imagem que vaza para a próxima seção */}
        <div className="relative mt-16 px-6 z-10">
          <img 
            src={sectionHero} 
            alt="Hero"
            className="w-full max-w-md mx-auto rounded-3xl shadow-2xl drop-shadow-2xl"
          />
        </div>
      </section>

      {/* Section 2 - Seção clara com borda arredondada e imagem encaixada */}
      <section className="relative w-full bg-gradient-to-b from-[#f0e6ff] to-[#e5d5ff] rounded-t-[60px] -mt-24 pt-32 pb-32 overflow-visible">
        {/* Imagem que "encaixa" na curva da seção anterior */}
        <div className="relative -mt-48 mb-12 px-6 z-20">
          <img 
            src={sectionMiddle} 
            alt="Middle section"
            className="w-full max-w-sm mx-auto rounded-3xl shadow-2xl drop-shadow-2xl"
          />
        </div>
        
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2d1b4e] mb-4">
            Aprenda Brincando
          </h2>
          <p className="text-lg text-[#2d1b4e]/70 mb-8 max-w-2xl mx-auto">
            Jogos, quebra-cabeças e atividades interativas que ensinam valores cristãos
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="glass p-6 rounded-2xl">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="font-bold text-[#2d1b4e] mb-2">Jogos</h3>
              <p className="text-sm text-[#2d1b4e]/70">Diversão educativa garantida</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="font-bold text-[#2d1b4e] mb-2">Histórias</h3>
              <p className="text-sm text-[#2d1b4e]/70">Narrativas envolventes</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-bold text-[#2d1b4e] mb-2">Arte</h3>
              <p className="text-sm text-[#2d1b4e]/70">Criatividade sem limites</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Seção roxa com borda arredondada e imagem vazando */}
      <section className="relative w-full bg-gradient-to-b from-[#6b46c1] via-[#7c3aed] to-[#8b5cf6] rounded-t-[60px] -mt-20 pt-28 pb-32 overflow-visible">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Para Toda Família
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Conteúdo seguro e educativo para pais e filhos compartilharem juntos
          </p>
        </div>
        
        {/* Imagem que vaza para baixo */}
        <div className="relative mt-12 px-6 z-10">
          <img 
            src={sectionBottom} 
            alt="Bottom section"
            className="w-full max-w-sm mx-auto rounded-3xl shadow-2xl drop-shadow-2xl"
          />
        </div>
      </section>

      {/* Section 4 - Footer escuro com borda arredondada */}
      <section className="relative w-full bg-gradient-to-b from-[#1a0f2e] to-[#0a0118] rounded-t-[60px] -mt-24 pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comece Hoje Mesmo
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de famílias que já transformaram o aprendizado bíblico
          </p>
          <NeonButton onClick={() => console.log('Cadastrar')}>
            Criar Conta Grátis
          </NeonButton>
          
          <div className="mt-16 text-white/50 text-sm">
            <p>© 2025 BíbliaToonKIDS - Todos os direitos reservados</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageSections;
