

## Sistema de Carrosseis Personalizados

### Situação Atual

A página `/plataforma` já exibe automaticamente um carrossel para cada curso que possui módulos. O curso **"BíbliaToon KIDS - Contos Bíblicos"** possui 12 módulos e já aparece corretamente.

### O que será implementado

Um sistema gerenciável onde o admin pode criar carrosseis vinculados a cursos específicos, com controle sobre título, descrição, ordem e visibilidade.

---

### 1. Nova Tabela no Banco de Dados

**Tabela: `platform_carousels`**

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | ID único |
| course_id | uuid | Curso cujos módulos serão exibidos |
| title | text | Título customizado (opcional) |
| description | text | Descrição customizada (opcional) |
| display_order | integer | Ordem na página |
| available | boolean | Visível publicamente |

**Migração automática**: Criar carrossel para o curso "Contos Bíblicos" já existente, mantendo o comportamento atual.

---

### 2. Página de Gerenciamento (Admin)

**Nova página**: `src/pages/admin/plataforma/CarouselsManager.tsx`

**Funcionalidades**:
- Listar carrosseis existentes com ordenação
- Criar novo carrossel selecionando um curso
- Editar título/descrição customizados
- Toggle de visibilidade
- Excluir carrossel
- Preview da quantidade de módulos

**Interface do formulário:**
```text
┌──────────────────────────────────────────────────┐
│  Novo Carrossel                                  │
├──────────────────────────────────────────────────┤
│  Curso: [▼ Selecione um curso              ]     │
│                                                  │
│  Título (opcional):                              │
│  [________________________________]              │
│  Deixe vazio para usar o título do curso         │
│                                                  │
│  Descrição (opcional):                           │
│  [________________________________]              │
│                                                  │
│  [✓] Disponível                                  │
│                                                  │
│  ℹ️ Este curso tem 12 módulos                    │
│                                                  │
│                    [Salvar Carrossel]            │
└──────────────────────────────────────────────────┘
```

---

### 3. Atualizações de Arquivos

**`src/components/admin/AdminSidebar.tsx`**
- Adicionar item "Carrosseis" na seção Plataforma
- URL: `/admin/plataforma/carrosseis`
- Ícone: `LayoutGrid`

**`src/App.tsx`**
- Adicionar rota protegida para CarouselsManager

**`src/pages/plataforma/PlataformaPage.tsx`**
- Substituir a iteração automática sobre cursos
- Buscar carrosseis da tabela `platform_carousels`
- Para cada carrossel, mostrar módulos do curso vinculado
- Usar título/descrição customizados ou do curso (fallback)

---

### 4. SQL Migration

```sql
-- Criar tabela de carrosseis
CREATE TABLE IF NOT EXISTS public.platform_carousels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  available boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.platform_carousels ENABLE ROW LEVEL SECURITY;

-- Policy: Qualquer pessoa pode ver carrosseis disponíveis
CREATE POLICY "Anyone can view available carousels"
ON public.platform_carousels FOR SELECT
USING (available = true);

-- Policy: Admins podem gerenciar
CREATE POLICY "Admins can manage carousels"
ON public.platform_carousels FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Trigger para updated_at
CREATE TRIGGER update_platform_carousels_updated_at
  BEFORE UPDATE ON public.platform_carousels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Criar carrossel para o curso Contos Bíblicos existente
INSERT INTO public.platform_carousels (course_id, display_order, available)
SELECT id, display_order, true
FROM public.courses 
WHERE title LIKE '%Contos Bíblicos%';
```

---

### 5. Fluxo de Dados na Página Pública

```text
PlataformaPage
     │
     ▼
Busca platform_carousels (available=true)
     │
     ▼
Para cada carrossel:
  ├─ Busca módulos do course_id
  ├─ Usa título customizado OU título do curso
  ├─ Usa descrição customizada OU descrição do curso
  └─ Renderiza CourseCarousel com os módulos
```

---

### Arquivos a Criar/Modificar

| Ação | Arquivo |
|------|---------|
| Criar | Migration SQL |
| Criar | `src/pages/admin/plataforma/CarouselsManager.tsx` |
| Modificar | `src/components/admin/AdminSidebar.tsx` |
| Modificar | `src/App.tsx` |
| Modificar | `src/pages/plataforma/PlataformaPage.tsx` |

---

### Resultado Final

- O carrossel "Contos Bíblicos" continuará funcionando normalmente
- Admins poderão criar novos carrosseis para outros cursos
- Cada carrossel pode ter título/descrição personalizados
- Controle total sobre ordenação e visibilidade

