import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Smartphone, Share, MoreVertical, Plus, Globe, ArrowRight, LogIn } from "lucide-react";
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
          {/* Hero */}
          <motion.div variants={fadeInUp} className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              Baixe o App
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Tenha a BíbliaToonKIDS sempre com você! Escolha a melhor forma de instalar.
            </p>
          </motion.div>

          {/* Native App Section */}
          <motion.section variants={fadeInUp} className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground text-center">
              <Smartphone className="inline-block w-6 h-6 mr-2 text-primary" />
              App Nativo
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              Em breve disponível nas lojas oficiais!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* App Store Card */}
              <GlassCard className="flex flex-col items-center text-center space-y-4">
                <div className="w-full flex justify-center">
                  <a href="#" className="inline-block opacity-70 hover:opacity-100 transition-opacity">
                    <img
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                      alt="Baixar na App Store"
                      className="h-12"
                    />
                  </a>
                </div>
                <div className="w-32 h-32 bg-muted/30 rounded-xl flex items-center justify-center border border-border/50">
                  <p className="text-xs text-muted-foreground text-center px-2">
                    QR Code em breve
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Para iPhone e iPad
                </p>
              </GlassCard>

              {/* Google Play Card */}
              <GlassCard className="flex flex-col items-center text-center space-y-4">
                <div className="w-full flex justify-center">
                  <a href="#" className="inline-block opacity-70 hover:opacity-100 transition-opacity">
                    <img
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                      alt="Disponível no Google Play"
                      className="h-12"
                    />
                  </a>
                </div>
                <div className="w-32 h-32 bg-muted/30 rounded-xl flex items-center justify-center border border-border/50">
                  <p className="text-xs text-muted-foreground text-center px-2">
                    QR Code em breve
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Para Android
                </p>
              </GlassCard>
            </div>
          </motion.section>

          {/* PWA Section */}
          <motion.section variants={fadeInUp} className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground text-center">
              <Globe className="inline-block w-6 h-6 mr-2 text-primary" />
              Instalar pelo Navegador (PWA)
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              Instale direto do navegador, sem precisar de loja!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* iOS Instructions */}
              <GlassCard className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="text-2xl">🍎</span> iPhone / iPad
                </h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>
                      Abra o site no <strong className="text-foreground">Safari</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span className="flex items-center gap-1">
                      Toque no ícone <Share className="inline w-4 h-4 text-primary" /> <strong className="text-foreground">Compartilhar</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span className="flex items-center gap-1">
                      Selecione <Plus className="inline w-4 h-4 text-primary" /> <strong className="text-foreground">Adicionar à Tela de Início</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <span>
                      Toque em <strong className="text-foreground">Adicionar</strong> e pronto!
                    </span>
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
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>
                      Abra o site no <strong className="text-foreground">Google Chrome</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span className="flex items-center gap-1">
                      Toque nos <MoreVertical className="inline w-4 h-4 text-primary" /> <strong className="text-foreground">três pontinhos</strong> no canto superior
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span className="flex items-center gap-1">
                      Selecione <strong className="text-foreground">Instalar aplicativo</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <span>
                      Confirme e o app aparecerá na sua tela inicial!
                    </span>
                  </li>
                </ol>
              </GlassCard>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="text-center pt-4">
            <Link to="/login">
              <Button size="lg" className="gap-2">
                <LogIn className="w-5 h-5" />
                Ir para o Login
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default DownloadPage;
