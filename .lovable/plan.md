

# Carrossel de Lancamentos na Pagina Principal

## Resumo

Adicionar um carrossel de imagens com autoplay na pagina principal (Index) para destacar novidades do app. As imagens serao gerenciadas por uma nova secao no painel admin. Acima do carrossel, um card fino com o texto "Confira nossos Lancamentos".

## Estrutura Visual na Index

```text
[Video banner existente]
[Card "Acessar Cursos" existente]
[Card fino "Confira nossos Lancamentos"]  <-- NOVO
[Carrossel autoplay com imagens 150x290]  <-- NOVO
[Grid de cards 2 colunas existente]
```

O card "Confira nossos Lancamentos" sera um GlassCard mais fino (h-[50px]) sem acao de clique, apenas decorativo, seguindo o estilo visual do card "Acessar Cursos" mas sem imagem lateral.

O carrossel exibira as imagens em tamanho 150x290 (metade do 300x580 original), com autoplay a cada 3 segundos, usando o componente Embla Carousel ja existente no projeto.

## Etapas

### 1. Criar tabela `home_highlights` no Supabase

Nova tabela para armazenar as imagens de lancamentos:
- `id` (uuid, PK)
- `title` (text) - titulo opcional para referencia no admin
- `image_url` (text) - URL da imagem 300x580
- `link_to` (text, nullable) - rota opcional para navegar ao clicar
- `display_order` (integer, default 0)
- `available` (boolean, default true)
- `created_at` (timestamptz)

RLS: leitura publica para `available = true`, gerenciamento total para admins.

### 2. Criar pagina admin `HighlightsManager`

Nova pagina em `src/pages/admin/HighlightsManager.tsx` seguindo o padrao dos outros managers (ColoringManager, PrayersManager):
- Listagem dos highlights com imagem, titulo, ordem e status
- Formulario para adicionar/editar com MediaUploader (bucket: `criativos`)
- Campos: titulo, imagem (300x580), link opcional, ordem, disponivel
- Reordenacao e toggle de disponibilidade

### 3. Adicionar rota admin e link no sidebar

- Nova rota `/admin/highlights` em `App.tsx`
- Novo item "Lancamentos" no `AdminSidebar.tsx` com icone `Sparkles`

### 4. Adicionar carrossel na pagina Index

Modificar `src/pages/Index.tsx`:
- Query para buscar `home_highlights` ordenados por `display_order`
- Card fino GlassCard com texto "Confira nossos Lancamentos" (icone Sparkles)
- Carrossel Embla com autoplay (intervalo de 3s), mostrando imagens em 150x290
- Cada item clicavel navega para `link_to` se definido
- Posicionado entre o card "Acessar Cursos" e o grid de funcionalidades
- Se nao houver highlights disponiveis, a secao inteira nao aparece

### 5. Autoplay do carrossel

Usar o plugin `embla-carousel-autoplay` (ja disponivel via embla-carousel-react) para rotacao automatica. O carrossel tera loop infinito e pausara ao toque do usuario, retomando apos soltar.

---

## Detalhes Tecnicos

### Arquivos a criar
| Arquivo | Descricao |
|---------|-----------|
| `src/pages/admin/HighlightsManager.tsx` | Pagina admin para gerenciar imagens de lancamentos |

### Arquivos a modificar
| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Index.tsx` | Adicionar query + card + carrossel de lancamentos |
| `src/App.tsx` | Nova rota `/admin/highlights` |
| `src/components/admin/AdminSidebar.tsx` | Novo item "Lancamentos" no menu |

### Migration SQL
```sql
CREATE TABLE home_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  link_to text,
  display_order integer NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE home_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available highlights"
  ON home_highlights FOR SELECT USING (available = true);

CREATE POLICY "Admins can manage highlights"
  ON home_highlights FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));
```

### Dependencia adicional
- `embla-carousel-autoplay` - plugin de autoplay para o Embla Carousel

