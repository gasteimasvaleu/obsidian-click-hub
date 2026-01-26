

## Remoção do Card de Carrossel de Cursos

### Contexto
Como agora existe uma área dedicada para gerenciamento de carrosseis (`/admin/plataforma/carrosseis`), o card "Carrossel de Cursos" na página de Configurações da Plataforma ficou redundante e deve ser removido.

---

### Mudanças Necessárias

**Arquivo:** `src/pages/admin/plataforma/PlatformSettingsManager.tsx`

1. **Remover o Card do Carrossel** (linhas 245-278)
   - Excluir todo o bloco `<Card>` que contém os campos de título e descrição do carrossel

2. **Atualizar a interface `PlatformSettings`** (linhas 15-25)
   - Remover `carousel_title` e `carousel_description` da interface

3. **Atualizar `defaultSettings`** (linhas 27-37)
   - Remover `carousel_title` e `carousel_description` dos valores padrão

---

### Código a Remover

```typescript
// Da interface PlatformSettings (remover estas linhas):
carousel_title: string;
carousel_description: string;

// Do defaultSettings (remover estas linhas):
carousel_title: "",
carousel_description: "",

// Remover todo este bloco Card (linhas 245-278):
<Card>
  <CardHeader>
    <CardTitle>Carrossel de Cursos</CardTitle>
    ...
  </CardHeader>
  <CardContent>
    ...
  </CardContent>
</Card>
```

---

### Resultado

A página de Configurações da Plataforma ficará apenas com:
- Configurações do Header (banner/vídeo e textos)
- Botão de salvar

Os carrosseis agora são gerenciados exclusivamente na área dedicada `/admin/plataforma/carrosseis`.

