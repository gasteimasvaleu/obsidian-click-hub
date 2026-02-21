import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedRoutesProps {
  children: ReactNode;
}

export const AnimatedRoutes = ({ children }: AnimatedRoutesProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ minHeight: "100vh" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
