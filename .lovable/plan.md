
# Pagina Comunidade -- Feed Social

## Resumo

Criar a pagina de comunidade onde usuarios podem publicar posts com texto e fotos, curtir e comentar. A pagina sera acessivel apenas pelo card na pagina inicial (Index), sem adicionar ao menu inferior (tubelight navbar).

## Banco de Dados

Tres novas tabelas com RLS:

```text
community_posts          community_comments        community_likes
+-----------------+      +------------------+      +------------------+
| id (PK)         |      | id (PK)          |      | id (PK)          |
| user_id (FK)    |<-----| post_id (FK)     |      | post_id (FK)     |
| content (text)  |      | user_id (FK)     |      | user_id (FK)     |
| image_url       |      | content (text)   |      | created_at       |
| likes_count     |      | created_at       |      | UNIQUE(post,user)|
| created_at      |      +------------------+      +------------------+
| updated_at      |
+-----------------+
```

### Politicas RLS
- **Posts**: Autenticados podem ler e criar (proprio user_id); autor ou admin podem deletar
- **Comentarios**: Autenticados podem ler e criar; autor ou admin podem deletar
- **Likes**: Autenticados podem ler, inserir e deletar os proprios

### Trigger
- Funcao `update_post_likes_count()` para incrementar/decrementar `likes_count` automaticamente ao inserir/deletar likes

### Storage
- Criar bucket publico `community` com RLS para upload por usuarios autenticados e leitura publica

## Arquivos a Criar

### 1. Migracao SQL
Arquivo de migracao com as 3 tabelas, RLS, trigger e bucket de storage.

### 2. `src/pages/Comunidade.tsx`
Pagina principal com:
- Header com titulo "Comunidade"
- Formulario de novo post no topo (texto + botao foto + publicar)
- Feed de posts ordenados por data (mais recentes primeiro)
- Botao "Carregar mais" para paginacao
- Estilo dark/glass seguindo o padrao do app

### 3. `src/components/comunidade/PostForm.tsx`
- Campo de texto (max 500 caracteres)
- Botao para anexar foto (max 5MB, PNG/JPG/WEBP)
- Preview da foto antes de publicar
- Upload para bucket `community` via `uploadMedia`
- Botao "Publicar"

### 4. `src/components/comunidade/PostCard.tsx`
- Avatar e nome do autor (join com profiles)
- Data relativa (ex: "ha 2 horas")
- Texto do post
- Imagem (se houver)
- Botoes de curtir (com contagem) e comentar
- Botao deletar para o autor/admin
- Animacao no like com framer-motion

### 5. `src/components/comunidade/CommentSection.tsx`
- Secao expansivel de comentarios
- Lista de comentarios do post
- Campo para adicionar novo comentario

### 6. `src/components/comunidade/CommentItem.tsx`
- Avatar e nome do autor
- Texto do comentario
- Data relativa
- Botao deletar para o autor/admin

## Arquivos a Editar

### 7. `src/App.tsx`
- Importar `Comunidade` e adicionar rota `/comunidade` protegida com `ProtectedRoute`
- Nao alterar o array `navItems` (sem adicionar ao menu inferior)

### 8. `src/pages/Index.tsx`
- Adicionar icone `MessagesSquare` no import do lucide-react
- Adicionar card "Comunidade" no array `navigationActions` com gradiente adequado (ex: `from-emerald-500 to-teal-500`) e icone `MessagesSquare`

## Detalhes Tecnicos

### Queries
- Posts: `select *, profiles(full_name, avatar_url)` ordenado por `created_at desc` com limit/offset
- Comentarios: `select *, profiles(full_name, avatar_url)` filtrado por `post_id`
- Likes do usuario: `select post_id from community_likes where user_id = auth.uid()`
- Todas as queries via React Query com invalidacao automatica apos mutations

### Funcionalidades
1. Criar post com texto e/ou foto
2. Feed paginado com "carregar mais"
3. Curtir/descurtir com animacao e contagem em tempo real
4. Comentar em posts
5. Deletar proprio post/comentario
6. Admin pode deletar qualquer post/comentario

### Icones utilizados (Lucide)
- `MessagesSquare` -- card na Index
- `Heart` / `HeartOff` -- curtir
- `MessageCircle` -- comentar
- `Trash2` -- deletar
- `ImagePlus` -- anexar foto
- `Send` -- enviar post/comentario
