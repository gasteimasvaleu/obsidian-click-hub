import { Info } from "lucide-react";

export const FuturisticNavbar = () => {
  return (
    <nav className="navbar-glass fixed top-0 left-0 right-0 z-50 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-primary font-bold text-lg hover:animate-glow transition-all duration-300">
          BíbliaToonKIDS
        </h1>
        <Info 
          size={24} 
          className="text-primary hover:animate-glow cursor-pointer transition-all duration-300" 
        />
      </div>
    </nav>
  );
};