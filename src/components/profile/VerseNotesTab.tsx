import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, BookOpen, Pencil, Trash2, StickyNote, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface VerseNotesTabProps {
  userId: string;
}

interface VerseNote {
  id: string;
  note: string;
  created_at: string;
  updated_at: string;
  verse_id: string;
  bible_verses: {
    text: string;
    verse_number: number;
    bible_chapters: {
      chapter_number: number;
      book_id: string;
      bible_books: {
        name: string;
      };
    };
  };
}

export const VerseNotesTab = ({ userId }: VerseNotesTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState<VerseNote | null>(null);
  const [editText, setEditText] = useState('');
  const [deletingNote, setDeletingNote] = useState<VerseNote | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ['user-verse-notes', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_verse_notes')
        .select(`
          id,
          note,
          created_at,
          updated_at,
          verse_id,
          bible_verses (
            text,
            verse_number,
            bible_chapters (
              chapter_number,
              book_id,
              bible_books (
                name
              )
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as VerseNote[];
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ noteId, text }: { noteId: string; text: string }) => {
      const { error } = await supabase
        .from('user_verse_notes')
        .update({ note: text, updated_at: new Date().toISOString() })
        .eq('id', noteId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-verse-notes', userId] });
      toast.success('Nota atualizada!');
      setEditingNote(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar nota');
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from('user_verse_notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-verse-notes', userId] });
      toast.success('Nota excluída!');
      setDeletingNote(null);
    },
    onError: () => {
      toast.error('Erro ao excluir nota');
    },
  });

  const handleEdit = (note: VerseNote) => {
    setEditingNote(note);
    setEditText(note.note);
  };

  const handleSaveEdit = () => {
    if (editingNote && editText.trim()) {
      updateNoteMutation.mutate({ noteId: editingNote.id, text: editText.trim() });
    }
  };

  const handleNavigateToVerse = (note: VerseNote) => {
    const bookId = note.bible_verses.bible_chapters.book_id;
    const chapter = note.bible_verses.bible_chapters.chapter_number;
    navigate(`/biblia/${bookId}/${chapter}`);
  };

  const getVerseReference = (note: VerseNote) => {
    const bookName = note.bible_verses.bible_chapters.bible_books.name;
    const chapter = note.bible_verses.bible_chapters.chapter_number;
    const verse = note.bible_verses.verse_number;
    return `${bookName} ${chapter}:${verse}`;
  };

  const filteredNotes = notes?.filter((note) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const reference = getVerseReference(note).toLowerCase();
    const noteText = note.note.toLowerCase();
    const verseText = note.bible_verses.text.toLowerCase();
    return reference.includes(search) || noteText.includes(search) || verseText.includes(search);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <StickyNote className="w-4 h-4" />
        <span>{notes?.length || 0} anotações salvas</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por referência ou texto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background/50 border-primary/20"
        />
      </div>

      {/* Notes List */}
      {!filteredNotes || filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <StickyNote className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            {searchTerm ? 'Nenhuma anotação encontrada.' : 'Você ainda não tem anotações. Faça anotações nos versículos da Bíblia!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="bg-primary/5 border-primary/10">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                  {/* Reference */}
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold text-sm">
                      📖 {getVerseReference(note)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Verse text */}
                  <p className="text-sm text-muted-foreground italic line-clamp-2">
                    "{note.bible_verses.text}"
                  </p>

                  {/* User note */}
                  <div className="bg-background/50 rounded-lg p-3 border border-primary/10">
                    <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-primary/30 hover:bg-primary/10"
                      onClick={() => handleNavigateToVerse(note)}
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      Ver versículo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/30 hover:bg-primary/10"
                      onClick={() => handleEdit(note)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                      onClick={() => setDeletingNote(note)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent className="bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle>Editar Anotação</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-3">
              <p className="text-sm text-primary font-medium">
                {getVerseReference(editingNote)}
              </p>
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Sua anotação..."
                className="min-h-[120px] bg-background/50 border-primary/20"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNote(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!editText.trim() || updateNoteMutation.isPending}
            >
              {updateNoteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingNote} onOpenChange={() => setDeletingNote(null)}>
        <AlertDialogContent className="bg-card border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir anotação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A anotação será permanentemente removida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deletingNote && deleteNoteMutation.mutate(deletingNote.id)}
            >
              {deleteNoteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
