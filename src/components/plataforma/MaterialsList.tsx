import { Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Material {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size?: number;
}

interface MaterialsListProps {
  materials: Material[];
}

export function MaterialsList({ materials }: MaterialsListProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} KB`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return FileText;
    if (fileType.includes("sheet") || fileType.includes("excel")) return FileSpreadsheet;
    return File;
  };

  const getFileTypeLabel = (fileType: string) => {
    if (fileType.includes("pdf")) return "PDF";
    if (fileType.includes("word") || fileType.includes("document")) return "DOC";
    if (fileType.includes("sheet") || fileType.includes("excel")) return "XLS";
    return "ARQUIVO";
  };

  const handleDownload = (material: Material) => {
    const link = document.createElement("a");
    link.href = material.file_url;
    link.download = material.title;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (materials.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {materials.map((material) => {
        const Icon = getFileIcon(material.file_type);
        return (
          <div
            key={material.id}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group hover:bg-muted transition-colors"
          >
            <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">
                {material.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {getFileTypeLabel(material.file_type)}
                {material.file_size && ` • ${formatFileSize(material.file_size)}`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDownload(material)}
              className="flex-shrink-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
