import { supabase } from "@/integrations/supabase/client";

interface UploadOptions {
  file: File;
  bucket: string;
  folder: string;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadMedia(options: UploadOptions): Promise<UploadResult> {
  const { file, bucket, folder, maxSizeMB = 1000, acceptedTypes } = options;

  // Validate file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      success: false,
      error: `Arquivo muito grande. Máximo: ${maxSizeMB}MB`,
    };
  }

  // Validate file type
  if (acceptedTypes && !acceptedTypes.includes(file.type)) {
    return {
      success: false,
      error: `Tipo de arquivo não suportado. Aceitos: ${acceptedTypes.join(", ")}`,
    };
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split(".").pop();
  const fileName = `${timestamp}-${randomStr}.${extension}`;
  const filePath = `${folder}/${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return {
        success: false,
        error: uploadError.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Upload exception:", error);
    return {
      success: false,
      error: "Erro ao fazer upload do arquivo",
    };
  }
}

export async function deleteMedia(bucket: string, url: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${bucket}/`);
    if (pathParts.length < 2) return false;
    
    const filePath = decodeURIComponent(pathParts[1]);
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete exception:", error);
    return false;
  }
}

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
