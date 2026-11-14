import { ArrowNavButton } from "@/components/plataforma/BackArrowButton";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ParentalGate } from "@/components/ParentalGate";

interface ExternalFrameProps {
  url: string;
  title?: string;
}

export const ExternalFrame = ({ url, title = "External Content" }: ExternalFrameProps) => {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);

  if (!verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ParentalGate
          open={true}
          onOpenChange={(open) => {
            if (!open) navigate(-1);
          }}
          onSuccess={() => setVerified(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative pb-24">
      {/* Header with back button */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-lg border-b border-primary/20 p-4">
        <div className="flex items-center gap-4">
          <ArrowNavButton direction="left" label="Voltar" onClick={() => navigate(-1)} className="!w-28 !h-9" />
          <h1 className="text-primary font-medium">{title}</h1>
        </div>
      </div>

      {/* Iframe content */}
      <div className="pt-20 pb-24 h-screen">
        <iframe
          src={url}
          title={title}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-navigation"
        />
      </div>
    </div>
  );
};