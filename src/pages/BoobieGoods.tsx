import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";

const BoobieGoods = () => {
  const handleShopClick = () => {
    console.log("Navegando para loja...");
  };

  return (
    <div className="min-h-screen bg-black relative pb-24">
      <FuturisticNavbar />
      
      <div className="flex items-center justify-center min-h-screen pt-16">
        <GlassCard className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-primary mb-6">BoobieGoods</h1>
          <p className="text-primary/80 mb-8 text-lg">
            Descubra nossa coleção exclusiva de produtos premium
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass rounded-xl p-4">
              <h3 className="text-primary font-semibold mb-2">Categoria 1</h3>
              <p className="text-primary/60 text-sm">Produtos exclusivos</p>
            </div>
            <div className="glass rounded-xl p-4">
              <h3 className="text-primary font-semibold mb-2">Categoria 2</h3>
              <p className="text-primary/60 text-sm">Edições limitadas</p>
            </div>
          </div>
          
          <NeonButton onClick={handleShopClick}>
            Ver Catálogo
          </NeonButton>
        </GlassCard>
      </div>
    </div>
  );
};

export default BoobieGoods;