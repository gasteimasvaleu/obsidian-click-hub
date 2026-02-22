import { Button } from '@/components/ui/button';
import { Palette, BookOpen, Cross, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

const categories = [
  { value: 'all', label: 'Todos', icon: Palette },
  { value: 'contos', label: 'Contos', icon: BookOpen },
  { value: 'parabolas', label: 'Parábolas', icon: Sparkles },
  { value: 'personagens', label: 'Personagens', icon: Cross },
];

export const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selected === cat.value;
        return (
          <Button
            key={cat.value}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(cat.value)}
            className={`w-full transition-all duration-300 active:scale-95 group ${
              isActive ? 'neon-glow shadow-lg shadow-primary/50' : 'hover:border-primary/50'
            }`}
          >
            <Icon size={16} className="transition-transform duration-300 group-hover:rotate-12" />
            {cat.label}
          </Button>
        );
      })}
    </div>
  );
};
