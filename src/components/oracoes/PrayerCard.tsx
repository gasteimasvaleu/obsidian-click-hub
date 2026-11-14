import { Star, Share2, Copy, Check } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { BubbleTitleText } from "@/components/ui/bubble-title-text";
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
    <div>
      <div className="neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl py-3 pl-4 pr-14 text-feature-foreground">
        <span aria-hidden className="border-beam" />
        <h3 className="bubble-title relative"><BubbleTitleText text={title} /></h3>
        <button
          onClick={() => onToggleFavorite(id)}
          className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full transition-all hover:bg-primary-foreground/10"
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Star size={22} className={isFavorite ? "fill-current" : "opacity-80"} />
        </button>
      </div>
      <GlassCard className="-mt-4 pt-7 rounded-t-none">
        <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{content}</p>
        <div className="mt-4 flex overflow-hidden rounded-full border border-primary/30 divide-x divide-primary/20">
          <button onClick={handleCopy} aria-label="Copiar" className="flex h-11 flex-1 items-center justify-center text-primary transition-colors hover:bg-primary/10">
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
          <button onClick={handleShare} aria-label="Compartilhar" className="flex h-11 flex-1 items-center justify-center text-primary transition-colors hover:bg-primary/10">
            <Share2 size={20} />
          </button>
        </div>
      </GlassCard>
      <ParentalGate
        open={showGate}
        onOpenChange={setShowGate}
        onSuccess={() => {
          const encodedText = encodeURIComponent(pendingShareText);
          window.open(`https://wa.me/?text=${encodedText}`, "_blank");
        }}
      />
    </div>
  );
};
