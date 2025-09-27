import { Info } from "lucide-react";

export const FuturisticNavbar = () => {
  return (
    <nav className="navbar-glass fixed top-0 left-0 right-0 z-50 p-4">
      <div className="flex justify-end">
        <Info 
          size={24} 
          className="text-primary hover:animate-glow cursor-pointer transition-all duration-300" 
        />
      </div>
    </nav>
  );
};