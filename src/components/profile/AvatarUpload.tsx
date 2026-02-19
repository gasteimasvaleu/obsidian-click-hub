import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: (url: string) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export const AvatarUpload = ({
  currentAvatarUrl,
  userId,
  userName,
  userEmail,
  open,
  onOpenChange,
  onUploadSuccess,
}: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O tamanho máximo permitido é 2MB.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file format
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      toast({
        title: 'Formato não suportado',
        description: 'Use PNG, JPG ou WEBP.',
        variant: 'destructive',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      // Upload new avatar
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: 'Avatar atualizado! ✨',
        description: 'Sua foto foi atualizada com sucesso.',
      });

      onUploadSuccess(publicUrl);
      onOpenChange(false);
      setPreview(null);
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Erro ao fazer upload',
        description: error.message || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatarUrl) return;

    setUploading(true);
    try {
      // Delete from storage
      const oldPath = currentAvatarUrl.split('/').slice(-2).join('/');
      await supabase.storage.from('avatars').remove([oldPath]);

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: 'Avatar removido',
        description: 'Sua foto foi removida com sucesso.',
      });

      onUploadSuccess('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Remove error:', error);
      toast({
        title: 'Erro ao remover avatar',
        description: error.message || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const displayUrl = preview || currentAvatarUrl;
  const initials = userName?.charAt(0) || userEmail?.charAt(0).toUpperCase() || '?';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass">
        <DialogHeader>
          <DialogTitle className="text-primary">Alterar Avatar</DialogTitle>
          <DialogDescription>
            Escolha uma foto (PNG, JPG ou WEBP, máx 2MB)
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Preview */}
          <Avatar className="w-32 h-32 border-4 border-primary/30">
            {displayUrl ? (
              <AvatarImage src={displayUrl} />
            ) : (
              <AvatarFallback className="bg-primary/20 text-primary text-4xl font-bold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>

          {/* File Input */}
          <div className="flex flex-col gap-3 w-full">
            <label htmlFor="avatar-upload">
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                asChild
                disabled={uploading}
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Imagem
                </span>
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>

            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fazendo upload...
                  </>
                ) : (
                  'Confirmar Upload'
                )}
              </Button>
            )}

            {currentAvatarUrl && !preview && (
              <Button
                variant="outline"
                onClick={handleRemoveAvatar}
                disabled={uploading}
                className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
              >
                <X className="w-4 h-4 mr-2" />
                Remover Avatar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
