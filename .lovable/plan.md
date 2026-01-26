

## Criar PlataformaLayout Wrapper

### Objetivo
Criar um componente wrapper `PlataformaLayout` que centraliza a navbar superior e os paddings corretos, eliminando repetição de código nas páginas da plataforma.

---

### Arquivos a Criar

#### 1. `src/components/plataforma/PlataformaLayout.tsx`

```tsx
import { FuturisticNavbar } from "@/components/FuturisticNavbar";

interface PlataformaLayoutProps {
  children: React.ReactNode;
}

export function PlataformaLayout({ children }: PlataformaLayoutProps) {
  return (
    <div className="min-h-screen pb-24 pt-16">
      <FuturisticNavbar />
      {children}
    </div>
  );
}
```

---

### Arquivos a Modificar

#### 2. `src/pages/plataforma/PlataformaPage.tsx`

**Mudanças:**
- Remover import do `FuturisticNavbar`
- Adicionar import do `PlataformaLayout`
- Substituir a div wrapper pelo `PlataformaLayout`
- Remover a chamada `<FuturisticNavbar />` do JSX

**De:**
```tsx
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
// ...
return (
  <div className="min-h-screen pb-24 pt-16">
    <FuturisticNavbar />
    {/* conteúdo */}
  </div>
);
```

**Para:**
```tsx
import { PlataformaLayout } from "@/components/plataforma/PlataformaLayout";
// ...
return (
  <PlataformaLayout>
    {/* conteúdo */}
  </PlataformaLayout>
);
```

---

#### 3. `src/pages/plataforma/CoursePage.tsx`

**Mudanças:**
- Adicionar import do `PlataformaLayout`
- Envolver o conteúdo principal com `PlataformaLayout`
- Ajustar os estados de loading e erro para também usar o layout

**De:**
```tsx
return (
  <div className="min-h-screen pb-24">
    {/* Hero Banner e conteúdo */}
  </div>
);
```

**Para:**
```tsx
import { PlataformaLayout } from "@/components/plataforma/PlataformaLayout";
// ...
return (
  <PlataformaLayout>
    {/* Hero Banner e conteúdo */}
  </PlataformaLayout>
);
```

---

#### 4. `src/pages/plataforma/ModulePage.tsx`

**Mudanças:**
- Adicionar import do `PlataformaLayout`
- Envolver o conteúdo principal com `PlataformaLayout`
- Ajustar os estados de loading e erro para também usar o layout

**De:**
```tsx
return (
  <div className="min-h-screen pb-24">
    {/* Hero Banner e conteúdo */}
  </div>
);
```

**Para:**
```tsx
import { PlataformaLayout } from "@/components/plataforma/PlataformaLayout";
// ...
return (
  <PlataformaLayout>
    {/* Hero Banner e conteúdo */}
  </PlataformaLayout>
);
```

---

#### 5. `src/pages/plataforma/LessonPage.tsx`

**Mudanças:**
- Adicionar import do `PlataformaLayout`
- Envolver o conteúdo principal com `PlataformaLayout`
- Ajustar os estados de loading e erro para também usar o layout

**De:**
```tsx
return (
  <div className="min-h-screen pb-24">
    {/* Conteúdo da aula */}
  </div>
);
```

**Para:**
```tsx
import { PlataformaLayout } from "@/components/plataforma/PlataformaLayout";
// ...
return (
  <PlataformaLayout>
    {/* Conteúdo da aula */}
  </PlataformaLayout>
);
```

---

### Resumo das Alterações

| Arquivo | Ação |
|---------|------|
| `src/components/plataforma/PlataformaLayout.tsx` | Criar novo |
| `src/pages/plataforma/PlataformaPage.tsx` | Refatorar para usar PlataformaLayout |
| `src/pages/plataforma/CoursePage.tsx` | Adicionar PlataformaLayout |
| `src/pages/plataforma/ModulePage.tsx` | Adicionar PlataformaLayout |
| `src/pages/plataforma/LessonPage.tsx` | Adicionar PlataformaLayout |

---

### Benefícios

- **DRY (Don't Repeat Yourself):** Remove a duplicação de código de layout em 4 páginas
- **Manutenção Simplificada:** Alterações futuras na navbar ou paddings são feitas em um único lugar
- **Consistência Visual:** Garante que todas as páginas da plataforma tenham a mesma estrutura
- **Escalabilidade:** Facilita a adição de novas páginas da plataforma no futuro

