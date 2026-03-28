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
            <Link to="/login">
              <Button size="lg" className="gap-2 mt-2">
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
