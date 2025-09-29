import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { name: 'Ebooks', url: '/admin/ebooks', icon: BookOpen },
  { name: 'Jogos', url: '/admin/games', icon: Gamepad2 },
];

export const AdminSidebar = () => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass border-r border-primary/20">
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
      </nav>
    </aside>
  );
};
