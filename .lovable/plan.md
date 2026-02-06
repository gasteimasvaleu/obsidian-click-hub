
# Plano: Colorir Biblico Digital

## Visao Geral

Criar uma experiencia completa de colorir digital para criancas, com duas modalidades principais:

1. **Galeria de Desenhos Biblicos** - Desenhos pre-criados para colorir
2. **Transformar Foto em Desenho** - Usar IA para transformar fotos em paginas de colorir (ja existe a edge function!)

---

## Funcionalidades Principais

### 1. Galeria de Desenhos Biblicos
- Categorias tematicas: Antigo Testamento, Novo Testamento, Personagens, Animais da Arca, etc.
- Desenhos em preto e branco prontos para colorir
- Sistema de dificuldade: Facil, Medio, Avancado (mais detalhes)

### 2. Editor de Colorir Digital
- Canvas interativo para colorir com toque/mouse
- Paleta de cores vibrantes e amigaveis para criancas
- Ferramentas: Pincel, Balde de tinta, Borracha, Desfazer/Refazer
- Opcao de ajustar tamanho do pincel

### 3. Transformar Foto em Desenho
- Upload de foto pessoal
- IA transforma em desenho de colorir (edge function ja existe!)
- Colorir a propria foto transformada

### 4. Galeria Pessoal (Minhas Criacoes)
- Salvar desenhos coloridos no perfil
- Visualizar historico de criacoes
- Compartilhar via WhatsApp/Download

### 5. Gamificacao
- Ganhar pontos ao completar desenhos (+15 pontos)
- Badges especificos: "Primeiro Desenho", "5 Desenhos", "10 Desenhos", "Artista Biblico"
- Contador ja existe no banco: `coloring_completed`

---

## Estrutura de Arquivos

```text
src/
  pages/
    colorir/
      ColorirPage.tsx           # Pagina principal com galeria
      ColoringEditorPage.tsx    # Editor de colorir
      PhotoTransformPage.tsx    # Transformar foto em desenho
      MyCreationsPage.tsx       # Galeria pessoal

  components/
    colorir/
      DrawingCard.tsx           # Card de desenho na galeria
      CategoryFilter.tsx        # Filtro por categorias
      ColoringCanvas.tsx        # Canvas de colorir principal
      ColorPalette.tsx          # Paleta de cores
      BrushSizeSlider.tsx       # Controle de tamanho do pincel
      ToolBar.tsx               # Barra de ferramentas
      PhotoUploader.tsx         # Upload de foto
      CreationCard.tsx          # Card de criacao salva
      ShareModal.tsx            # Modal de compartilhamento

  hooks/
    useColoringCanvas.tsx       # Logica do canvas
```

---

## Banco de Dados

### Nova Tabela: `coloring_drawings`
Desenhos pre-criados para a galeria:

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid | ID unico |
| title | text | Nome do desenho |
| description | text | Descricao curta |
| image_url | text | URL da imagem em preto e branco |
| category | text | Categoria (antigo_testamento, novo_testamento, personagens, etc.) |
| difficulty | text | facil, medio, avancado |
| display_order | integer | Ordem de exibicao |
| available | boolean | Se esta disponivel |
| created_at | timestamp | Data de criacao |

### Nova Tabela: `user_coloring_creations`
Desenhos coloridos salvos pelo usuario:

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid | ID unico |
| user_id | uuid | ID do usuario |
| drawing_id | uuid | ID do desenho original (opcional, null se for foto transformada) |
| original_image_url | text | URL da imagem original |
| colored_image_url | text | URL da imagem colorida salva |
| title | text | Titulo dado pelo usuario |
| is_from_photo | boolean | Se foi gerado a partir de foto |
| created_at | timestamp | Data de criacao |

### Novo Storage Bucket: `coloring`
- Pasta `drawings/` - Desenhos pre-criados
- Pasta `creations/` - Desenhos coloridos pelos usuarios

---

## Fluxo de Usuario

```text
[Colorir Page]
     |
     +---> [Galeria de Desenhos]
     |          |
     |          +---> [Selecionar Desenho] ---> [Editor de Colorir]
     |                                                |
     |                                                +---> [Salvar] ---> [Minhas Criacoes]
     |                                                |
     |                                                +---> [Compartilhar]
     |
     +---> [Transformar Foto]
     |          |
     |          +---> [Upload Foto] ---> [IA Transforma] ---> [Editor de Colorir]
     |
     +---> [Minhas Criacoes]
                |
                +---> [Ver/Editar/Compartilhar/Excluir]
```

---

## Interface do Editor de Colorir

```text
+--------------------------------------------------+
|  < Voltar          Minha Obra           [Salvar] |
+--------------------------------------------------+
|                                                  |
|                                                  |
|                                                  |
|              [CANVAS DE DESENHO]                 |
|                                                  |
|                                                  |
|                                                  |
+--------------------------------------------------+
|  Tamanho: [=====o======]                         |
+--------------------------------------------------+
|  [Pincel] [Balde] [Borracha] [Desfazer] [Refazer]|
+--------------------------------------------------+
|  [🔴][🟠][🟡][🟢][🔵][🟣][🟤][⚫][⚪][...]       |
+--------------------------------------------------+
```

---

## Detalhes Tecnicos

### Canvas de Colorir
- Usar HTML5 Canvas API
- Implementar flood-fill (balde de tinta) para areas fechadas
- Historico de acoes para undo/redo
- Exportar como PNG para salvar

### Paleta de Cores
- 24 cores vibrantes pre-selecionadas
- Opcao de cor customizada (color picker)
- Cores favoritas do usuario

### Salvamento
- Converter canvas para blob
- Upload para Supabase Storage
- Salvar referencia na tabela `user_coloring_creations`

### Compartilhamento
- Download direto da imagem
- Compartilhar via Web Share API (WhatsApp, etc.)

---

## Gamificacao Expandida

### Pontuacao
- Colorir desenho da galeria: +15 pontos
- Colorir foto transformada: +20 pontos
- Primeiro desenho do dia: +5 pontos bonus

### Novos Badges
- `first_coloring` - Primeiro desenho colorido
- `coloring_5` - 5 desenhos coloridos
- `coloring_10` - 10 desenhos coloridos
- `coloring_master` - 25 desenhos coloridos
- `photo_artist` - Primeira foto transformada

---

## Admin Dashboard

Nova secao em `/admin/colorir`:
- Gerenciar desenhos da galeria
- Upload de novos desenhos
- Organizar categorias e ordem
- Ver estatisticas de uso

---

## Integracao com Index.tsx

Adicionar novo card na pagina inicial:
- Icone: Palette ou Paintbrush
- Titulo: "Colorir"
- Gradiente: from-orange-500 to-yellow-500
- Rota: /colorir

---

## Etapas de Implementacao

### Fase 1: Estrutura Base
1. Criar tabelas no banco de dados
2. Criar bucket de storage
3. Configurar RLS policies
4. Criar rotas no App.tsx

### Fase 2: Galeria de Desenhos
5. Pagina principal ColorirPage
6. Componentes DrawingCard e CategoryFilter
7. Admin para gerenciar desenhos

### Fase 3: Editor de Colorir
8. Canvas interativo com ferramentas
9. Paleta de cores
10. Sistema de undo/redo

### Fase 4: Salvamento e Galeria Pessoal
11. Salvar criacoes no storage
12. Pagina Minhas Criacoes
13. Compartilhamento

### Fase 5: Transformar Foto
14. Integrar edge function existente
15. Fluxo de upload e transformacao

### Fase 6: Gamificacao
16. Atualizar useUserProgress
17. Adicionar novos badges
18. Confetti ao completar
