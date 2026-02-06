import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, FileVideo, FileImage, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { uploadMedia, deleteMedia, IMAGE_TYPES, VIDEO_TYPES, DOCUMENT_TYPES } from "@/lib/uploadMedia";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MediaUploaderProps {
  label: string;
  accept: "image" | "video" | "document";
  folder: string;
  bucket?: string;
  currentUrl?: string;
  onUploadSuccess: (url: string) => void;
  onRemove?: () => void;
  aspectRatio?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  dimensions?: string;
}

export function MediaUploader({
  label,
  accept,
  folder,
  bucket = "plataforma",
  currentUrl,
  onUploadSuccess,
  onRemove,
  aspectRatio,
  maxSizeMB = 1000,
  disabled = false,
  dimensions,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  // Sync preview state with currentUrl prop
  useEffect(() => {
    setPreview(currentUrl || null);
  }, [currentUrl]);

  const acceptedTypes = accept === "image" 
    ? IMAGE_TYPES 
    : accept === "video" 
    ? VIDEO_TYPES 
    : DOCUMENT_TYPES;

  const acceptConfig = accept === "image"
    ? { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }
    : accept === "video"
    ? { "video/*": [".mp4", ".webm", ".mov"] }
    : { "application/*": [".pdf", ".doc", ".docx", ".xls", ".xlsx"] };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    setUploading(true);
    setProgress(0);

    // Create preview for images/videos
    if (accept === "image" || accept === "video") {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    const result = await uploadMedia({
      file,
      bucket,
      folder,
      maxSizeMB,
      acceptedTypes,
    });

    clearInterval(progressInterval);
    setProgress(100);

    if (result.success && result.url) {
      onUploadSuccess(result.url);
      setPreview(result.url);
    } else {
      setError(result.error || "Erro no upload");
      setPreview(null);
    }

    setUploading(false);
  }, [accept, bucket, folder, maxSizeMB, acceptedTypes, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig,
    maxFiles: 1,
    disabled: disabled || uploading,
  });

  const handleRemove = async () => {
    // Delete from storage if there's a saved URL
    if (currentUrl) {
      await deleteMedia(bucket, currentUrl);
    }
    // Clear local preview
    setPreview(null);
    // Notify parent component
    onRemove?.();
  };

  const renderIcon = () => {
    if (accept === "video") return <FileVideo className="h-8 w-8 text-muted-foreground" />;
    if (accept === "image") return <FileImage className="h-8 w-8 text-muted-foreground" />;
    return <FileText className="h-8 w-8 text-muted-foreground" />;
  };

  const renderPreview = () => {
    if (!preview) return null;

    if (accept === "image") {
      return (
        <div className="relative w-full">
          {aspectRatio ? (
            <AspectRatio ratio={aspectRatio}>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </AspectRatio>
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-48 object-cover rounded-lg"
            />
          )}
        </div>
      );
    }

    if (accept === "video") {
      return (
        <div className="relative w-full">
          {aspectRatio ? (
            <AspectRatio ratio={aspectRatio}>
              <video
                src={preview}
                controls
                className="w-full h-full object-cover rounded-lg"
              />
            </AspectRatio>
          ) : (
            <video
              src={preview}
              controls
              className="w-full h-auto max-h-48 rounded-lg"
            />
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <FileText className="h-6 w-6" />
        <span className="text-sm truncate">Arquivo enviado</span>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {dimensions && (
          <span className="text-xs text-muted-foreground">{dimensions}</span>
        )}
      </div>

      {preview ? (
        <div className="relative">
          {renderPreview()}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
            "flex flex-col items-center justify-center gap-2",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            renderIcon()
          )}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isDragActive ? "Solte o arquivo aqui" : "Arraste ou clique para enviar"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Máximo: {maxSizeMB}MB
            </p>
          </div>
        </div>
      )}

      {uploading && (
        <Progress value={progress} className="h-2" />
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
