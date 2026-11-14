import { Link, useNavigate } from "react-router-dom";
import { Info, UserCircle, LogOut, LogIn, Settings } from "lucide-react";
import { ExpandMenu } from "@/components/ui/expand-menu";
import { useAuth } from "@/contexts/AuthContext";

export const FuturisticNavbar = ({ light = false }: { light?: boolean }) => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

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
        <ExpandMenu
          items={[
            ...(user
              ? [
                  { icon: <UserCircle size={18} />, label: "Meu Perfil", onClick: () => navigate("/profile") },
                  ...(isAdmin ? [{ icon: <Settings size={18} />, label: "Painel Admin", onClick: () => navigate("/admin") }] : []),
                ]
              : []),
            { icon: <Info size={18} />, label: "Sobre", onClick: () => navigate("/sobre") },
            user
              ? { icon: <LogOut size={18} />, label: "Sair", onClick: handleLogout, className: "text-destructive hover:text-destructive" }
              : { icon: <LogIn size={18} />, label: "Entrar", onClick: () => navigate("/login") },
          ]}
        />
      </div>
    </nav>
  );
};
