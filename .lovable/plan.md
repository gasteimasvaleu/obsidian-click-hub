
# Admin: Gerenciador de Desenhos para Colorir

## Objetivo

Criar a pagina `/admin/colorir` para gerenciar os desenhos da galeria de colorir, seguindo o mesmo padrao visual e funcional das outras paginas admin (EbooksManager, GamesManager).

## Alteracoes

### 1. Novo arquivo: `src/pages/admin/ColoringManager.tsx`

Pagina admin completa com:

- **Listagem** em tabela com colunas: Imagem (thumbnail), Titulo, Categoria, Dificuldade, Ordem, Status e Acoes
- **Dialog de criacao** com campos:
  - Titulo (texto, obrigatorio)
  - Descricao (textarea, opcional)
  - Categoria (select: Contos, Parabolas, Personagens)
  - Dificuldade (select: Facil, Medio, Dificil)
  - Ordem de exibicao (number)
  - Upload da imagem (usando MediaUploader com bucket `criativos`, folder `colorir`)
- **Dialog de edicao** com os mesmos campos, pre-preenchidos
- **Acoes por item**: Visibilidade (toggle), Editar, Excluir
- Usa `AdminLayout`, `ProtectedRoute`, e o mesmo padrao de estado/loading dos outros managers

### 2. Arquivo editado: `src/App.tsx`

- Importar `ColoringManager`
- Adicionar rota: `<Route path="/admin/colorir" element={<ColoringManager />} />`

### 3. Arquivo editado: `src/components/admin/AdminSidebar.tsx`

- Adicionar `Palette` ao import de lucide-react
- Adicionar item `{ name: 'Colorir', url: '/admin/colorir', icon: Palette }` no array `navItems`

## Detalhes Tecnicos

### Tabela utilizada: `coloring_drawings`

Colunas relevantes:
- `title` (text, obrigatorio)
- `description` (text, opcional)
- `image_url` (text, obrigatorio) -- URL da imagem no bucket `criativos`
- `category` (text, default `personagens`) -- valores: `contos`, `parabolas`, `personagens`
- `difficulty` (text, default `facil`) -- valores: `facil`, `medio`, `dificil`
- `display_order` (integer, default 0)
- `available` (boolean, default true)

### RLS ja configurada

A tabela ja tem policies:
- `Admins can manage coloring drawings` (ALL) -- para admins
- `Anyone can view available coloring drawings` (SELECT where available=true) -- para usuarios

Nao e necessario nenhuma migracao de banco de dados.

### Upload de imagens

Usara o componente `MediaUploader` existente apontando para:
- Bucket: `criativos`
- Folder: `colorir`

O bucket `criativos` ja tem RLS configurado para permitir upload por admins e leitura publica.

### Padrao de codigo

Seguira o mesmo padrao do `GamesManager.tsx`:
- `useState` para lista, loading, dialog, form
- `loadDrawings()` com `supabase.from('coloring_drawings').select('*').order('display_order')`
- `handleSubmit` para criar novo desenho
- `handleUpdate` para editar desenho existente
- `toggleAvailability` para alternar visibilidade
- `deleteDrawing` com confirmacao
