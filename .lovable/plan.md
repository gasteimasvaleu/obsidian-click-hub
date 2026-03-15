

## Plan: Add Edit Functionality to EbooksManager (Audiofy/Bíbliafy)

Currently the admin EbooksManager only supports create, toggle visibility, and delete. There is no way to edit an existing item's title, description, duration, or swap the audio file.

### Changes

**`src/pages/admin/EbooksManager.tsx`**:

1. Add edit state: `editingEbook` (Ebook | null) to track which item is being edited.

2. Add an Edit button (Pencil icon) in the actions column for each row, next to the existing eye/trash buttons.

3. When clicking Edit:
   - Populate the form fields (title, description, pages, duration, contentType, videoUrl) from the selected ebook.
   - Open the same dialog in "edit mode" (title changes to "Editar Conteúdo", submit button to "Salvar Alterações").
   - File upload becomes optional in edit mode (only re-upload if user selects a new file).

4. On submit in edit mode:
   - If a new file is selected, upload it and use the new URL; otherwise keep the existing `file_url`.
   - Call `supabase.from('ebooks').update({...}).eq('id', editingEbook.id)` instead of insert.
   - Reset form and reload list on success.

5. Update `resetForm` to also clear `editingEbook`.

6. Update dialog `onOpenChange` to reset edit state when closing.

This reuses the existing dialog/form, just toggling between create and edit mode based on whether `editingEbook` is set.

