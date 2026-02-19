import { Link } from "react-router-dom";
import { Info, UserCircle, LogOut, LogIn, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const FuturisticNavbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <nav className="navbar-glass fixed top-0 left-0 right-0 z-50 px-4 pt-2 pb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-primary font-bold text-lg hover:animate-glow transition-all duration-300">
          BíbliaToonKIDS
        </h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/profile">
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
              <button 
                onClick={handleLogout}
                className="focus:outline-none"
                title="Sair"
              >
                <LogOut 
                  size={24} 
                  className="text-primary hover:text-red-500 cursor-pointer transition-all duration-300" 
                />
              </button>
            </>
          ) : (
            <Link to="/login" title="Entrar">
              <LogIn 
                size={24} 
                className="text-primary hover:animate-glow cursor-pointer transition-all duration-300"
              />
            </Link>
          )}
          <Link to="/sobre">
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