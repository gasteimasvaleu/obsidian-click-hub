import { BookOpen, Star, Shield, Heart, UtensilsCrossed, Sparkles, Church, HeartHandshake, LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

export interface Category {
  id: string;
  name: string;
  icon: string;
}

const categories: Category[] = [
  { id: "essencial", name: "Essencial", icon: "book-open" },
  { id: "mariana", name: "Maria", icon: "star" },
  { id: "protecao", name: "Proteção", icon: "shield" },
  { id: "penitencia", name: "Penitência", icon: "heart" },
  { id: "refeicao", name: "Refeição", icon: "utensils-crossed" },
  { id: "espirito_santo", name: "Espírito Santo", icon: "sparkles" },
  { id: "eucaristica", name: "Eucarística", icon: "church" },
  { id: "misericordia", name: "Misericórdia", icon: "heart-handshake" },
];

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "star": Star,
  "shield": Shield,
  "heart": Heart,
  "utensils-crossed": UtensilsCrossed,
  "sparkles": Sparkles,
  "church": Church,
  "heart-handshake": HeartHandshake,
};

interface CategoryGridProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
}

export const CategoryGrid = ({
  selectedCategory,
  onSelectCategory,
  showFavorites,
  onToggleFavorites,
  favoritesCount,
}: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8">
      {/* Favorites button */}
      <GlassCard
        hoverable
        pressable
        onClick={onToggleFavorites}
        className={`flex flex-col items-center justify-center p-4 min-h-[100px] transition-all ${
          showFavorites
            ? "ring-2 ring-primary bg-primary/20"
            : ""
        }`}
      >
        <div className="relative">
          <Star
            size={28}
            className={`mb-2 ${showFavorites ? "text-primary fill-primary" : "text-primary"}`}
          />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </div>
        <span className="text-xs text-center text-foreground/80 font-medium">Favoritos</span>
      </GlassCard>

      {/* Category buttons */}
      {categories.map((category) => {
        const IconComponent = iconMap[category.icon] || Heart;
        const isSelected = selectedCategory === category.id && !showFavorites;

        return (
          <GlassCard
            key={category.id}
            hoverable
            pressable
            onClick={() => onSelectCategory(category.id)}
            className={`flex flex-col items-center justify-center p-4 min-h-[100px] transition-all ${
              isSelected
                ? "ring-2 ring-primary bg-primary/20"
                : ""
            }`}
          >
            <IconComponent
              size={28}
              className={`mb-2 ${isSelected ? "text-primary" : "text-primary/70"}`}
            />
            <span className="text-xs text-center text-foreground/80 font-medium">
              {category.name}
            </span>
          </GlassCard>
        );
      })}
    </div>
  );
};

export { categories };
