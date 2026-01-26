

## Adicionar FuturisticNavbar na página /plataforma

### Contexto
A página `/plataforma` atualmente não exibe a navbar superior (FuturisticNavbar) que mostra o logo "BíbliaToonKIDS" e os ícones de perfil/login/sobre. O menu inferior (tubelight-navbar) já está presente globalmente.

### Mudança Necessária

**Arquivo:** `src/pages/plataforma/PlataformaPage.tsx`

### 1. Importar o componente FuturisticNavbar

```tsx
import { FuturisticNavbar } from "@/components/FuturisticNavbar";
```

### 2. Adicionar a navbar no JSX

Adicionar o componente `<FuturisticNavbar />` no início do conteúdo da página, e ajustar o padding-top para acomodar a navbar fixa.

### 3. Ajustar o layout

Como a navbar é `fixed top-0`, o conteúdo da página precisa de um `pt-16` (ou similar) para não ficar escondido atrás dela.

**Container principal de:**
```tsx
<div className="min-h-screen pb-24">
```

**Para:**
```tsx
<div className="min-h-screen pb-24 pt-16">
```

### Resultado
- A navbar superior com o logo e ícones de perfil/login/sobre aparecerá na página /plataforma
- O hero banner e conteúdo ficarão corretamente posicionados abaixo da navbar
- Consistência visual com as outras páginas do app

