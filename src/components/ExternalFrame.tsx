import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ExternalFrameProps {
  url: string;
  title?: string;
}

export const ExternalFrame = ({ url, title = "External Content" }: ExternalFrameProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative pb-24">
      {/* Header with back button */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-lg border-b border-primary/20 p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-primary hover:bg-primary/10"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </Button>
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