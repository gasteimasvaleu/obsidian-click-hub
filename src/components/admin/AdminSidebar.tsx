import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Music, Gamepad2, GraduationCap, Layers, PlaySquare, FileText, Settings, LayoutGrid, Palette, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { name: 'Audiofy', url: '/admin/ebooks', icon: Music },
  { name: 'Jogos', url: '/admin/games', icon: Gamepad2 },
  { name: 'Colorir', url: '/admin/colorir', icon: Palette },
  { name: 'Lançamentos', url: '/admin/highlights', icon: Sparkles },
];

const plataformaItems = [
  { name: 'Configurações', url: '/admin/plataforma/configuracoes', icon: Settings },
  { name: 'Carrosseis', url: '/admin/plataforma/carrosseis', icon: LayoutGrid },
  { name: 'Cursos', url: '/admin/plataforma/cursos', icon: GraduationCap },
  { name: 'Módulos', url: '/admin/plataforma/modulos', icon: Layers },
  { name: 'Aulas', url: '/admin/plataforma/aulas', icon: PlaySquare },
  { name: 'Materiais', url: '/admin/plataforma/materiais', icon: FileText },
];

export const AdminSidebar = () => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass border-r border-primary/20 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === '/admin'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}

        {/* Plataforma Section */}
        <div className="pt-4 mt-4 border-t border-primary/10">
          <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Plataforma de Cursos
          </p>
          {plataformaItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};
