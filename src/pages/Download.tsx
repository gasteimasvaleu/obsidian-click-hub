import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Share, MoreVertical, Plus, Globe, ArrowRight, LogIn, CheckCircle } from "lucide-react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.15 } },
};

const DownloadPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <FuturisticNavbar />

      <main className="pt-20 pb-12 px-4 max-w-4xl mx-auto">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="space-y-10"
        >
          {/* Hero - Agradecimento */}
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              Obrigado!
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Sua conta foi criada com sucesso. Você já pode acessar o BíbliaToon KIDS!
            </p>
            <Link to="/login">
              <Button size="lg" className="gap-2 mt-2">
                <LogIn className="w-5 h-5" />
                Ir para o Login
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* PWA Section */}
          <motion.section variants={fadeInUp} className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground text-center">
              <Globe className="inline-block w-6 h-6 mr-2 text-primary" />
              Comprou pela Hotmart?
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              Siga as instruções abaixo para instalar o app no seu celular!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* iOS Instructions */}
              <GlassCard className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="text-2xl">🍎</span> iPhone / iPad
                </h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
                    <span>Abra o site no <strong className="text-foreground">Safari</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
                    <span className="flex items-center gap-1">Toque no ícone <Share className="inline w-4 h-4 text-primary" /> <strong className="text-foreground">Compartilhar</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">3</span>
                    <span className="flex items-center gap-1">Selecione <Plus className="inline w-4 h-4 text-primary" /> <strong className="text-foreground">Adicionar à Tela de Início</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">4</span>
                    <span>Toque em <strong className="text-foreground">Adicionar</strong> e pronto!</span>
                  </li>
                </ol>
              </GlassCard>

              {/* Android Instructions */}
              <GlassCard className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="text-2xl">🤖</span> Android
                </h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
                    <span>Abra o site no <strong className="text-foreground">Google Chrome</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
                    <span className="flex items-center gap-1">Toque nos <MoreVertical className="inline w-4 h-4 text-primary" /> <strong className="text-foreground">três pontinhos</strong> no canto superior</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">3</span>
                    <span>Selecione <strong className="text-foreground">Instalar aplicativo</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">4</span>
                    <span>Confirme e o app aparecerá na sua tela inicial!</span>
                  </li>
                </ol>
              </GlassCard>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default DownloadPage;
