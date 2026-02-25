import { Star, Share2, Copy, Check } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ParentalGate } from "@/components/ParentalGate";

interface PrayerCardProps {
  id: string;
  title: string;
  content: string;
  isFavorite: boolean;
  onToggleFavorite: (prayerId: string) => void;
}

export const PrayerCard = ({
  id,
  title,
  content,
  isFavorite,
  onToggleFavorite,
}: PrayerCardProps) => {
  const [copied, setCopied] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [pendingShareText, setPendingShareText] = useState("");

  const handleCopy = async () => {
    const text = `${title}\n\n${content}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Oração copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `${title}\n\n${content}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
        });
      } catch (error) {
        // User cancelled or share failed, try WhatsApp
        handleWhatsAppShare(text);
      }
    } else {
      handleWhatsAppShare(text);
    }
  };

  const handleWhatsAppShare = (text: string) => {
    setPendingShareText(text);
    setShowGate(true);
  };

  return (
    <GlassCard className="relative">
      {/* Favorite button */}
      <button
        onClick={() => onToggleFavorite(id)}
        className="absolute top-4 right-4 p-2 rounded-full transition-all hover:bg-primary/20"
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Star
          size={24}
          className={`transition-all ${
            isFavorite
              ? "text-primary fill-primary"
              : "text-foreground/40 hover:text-primary"
          }`}
        />
      </button>

      {/* Content */}
      <div className="pr-12">
        <h3 className="text-lg font-bold text-primary mb-3">{title}</h3>
        <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-foreground/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="flex-1 text-foreground/60 hover:text-primary hover:bg-primary/10"
        >
          {copied ? (
            <>
              <Check size={16} className="mr-2" />
              Copiado
            </>
          ) : (
            <>
              <Copy size={16} className="mr-2" />
              Copiar
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex-1 text-foreground/60 hover:text-primary hover:bg-primary/10"
        >
          <Share2 size={16} className="mr-2" />
          Compartilhar
        </Button>
      </div>
      <ParentalGate
        open={showGate}
        onOpenChange={setShowGate}
        onSuccess={() => {
          const encodedText = encodeURIComponent(pendingShareText);
          window.open(`https://wa.me/?text=${encodedText}`, "_blank");
        }}
      />
    </GlassCard>
  );
};
