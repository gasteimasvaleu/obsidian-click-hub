import { Link } from "react-router-dom";
import { Info, UserCircle, LogOut, LogIn, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const FuturisticNavbar = ({ light = false }: { light?: boolean }) => {
  const { user, isAdmin, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="navbar-glass fixed top-0 left-0 right-0 z-50 px-4 pb-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div className="flex justify-between items-center">
        <Link to="/" aria-label="BíbliaToon Club — Início">
          <img
            src="https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/logonova2navbar.png"
            alt="BíbliaToon"
            className={`h-8 w-auto transition-all duration-300 ${light ? "" : "hover:animate-glow"}`}
          />
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/profile" aria-label="Meu Perfil">
                <UserCircle
                  size={24}
                  className="text-primary hover:animate-glow cursor-pointer transition-all duration-300"
                />
              </Link>
              {isAdmin && (
                <Link to="/admin" title="Painel Admin">
                  <Settings
                    size={24}
                    className="text-primary hover:animate-glow cursor-pointer transition-all duration-300"
                  />
                </Link>
              )}
              <Button variant="ghost" size="icon"
                onClick={handleLogout}
                className="focus:outline-none"
                title="Sair"
              >
                <LogOut
                  size={24}
                  className="text-primary hover:text-destructive cursor-pointer transition-all duration-300"
                />
              </Button>
            </>
          ) : (
            <Link to="/login" title="Entrar">
              <LogIn
                size={24}
                className="text-primary hover:animate-glow cursor-pointer transition-all duration-300"
              />
            </Link>
          )}
          <Link to="/sobre" aria-label="Sobre">
            <Info
              size={24}
              className="text-primary hover:animate-glow cursor-pointer transition-all duration-300"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};
