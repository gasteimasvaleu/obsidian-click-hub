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
    <div className="flex overflow-hidden rounded-full border border-primary/30 bg-card divide-x divide-primary/20">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selected === cat.value;
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            aria-pressed={isActive}
            className={`flex h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
              isActive ? 'bg-primary/10 text-primary' : 'text-foreground/60 hover:bg-primary/5 hover:text-primary'
            }`}
          >
            <Icon size={18} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
