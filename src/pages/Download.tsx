import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
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
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              Obrigado!
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Sua conta foi criada com sucesso. Você já pode acessar o BíbliaToon Club!
            </p>
            <div className="flex flex-col gap-3 mt-4 items-center">
              <a href="https://apps.apple.com/app/id6759345320" target="_blank" rel="noopener noreferrer" className="w-full max-w-xs">
                <Button size="lg" className="w-full gap-3">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Baixe Agora na Apple Store
                </Button>
              </a>
              <Button size="lg" variant="outline" className="w-full max-w-xs gap-3" disabled>
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3.18 23.79L14.25 12.72 3.18.21a1.2 1.2 0 0 0-.18.63v22.32c0 .24.07.45.18.63zm1.44.77l12.35-6.93-2.86-2.86L4.62 24.56zM21.17 11.2l-3.5-1.97-3.15 3.15 3.15 3.15 3.5-1.97c.58-.33.83-.82.83-1.18s-.25-.85-.83-1.18zM4.62-.01L15.11 9.48l2.86-2.86L4.62-.01z"/></svg>
                Em Breve na Google Play
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default DownloadPage;
