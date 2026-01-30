

## Corrigir Visibilidade do Switch no Card do WhatsApp

### Problema Identificado

O Switch para ativar notificações do WhatsApp está presente no código, mas está invisível porque:
- A cor `bg-input` é `0 0% 100% / 0.05` (branco com apenas 5% de opacidade)
- Isso faz o Switch quando desativado parecer transparente no fundo escuro do card glass

### Solução

Adicionar uma classe personalizada ao Switch para garantir visibilidade, com um fundo mais contrastante.

### Alteração

**Arquivo: `src/components/profile/WhatsAppOptinSection.tsx`**

Modificar o Switch (linhas 203-208) para incluir classes de cor mais visíveis:

```tsx
<Switch
  id="whatsapp-optin"
  checked={optedIn}
  onCheckedChange={handleToggleOptin}
  disabled={saving}
  className="data-[state=unchecked]:bg-white/20"
/>
```

Isso vai:
- Manter o visual verde (primary) quando ativado
- Mostrar um fundo cinza claro (20% branco) quando desativado
- Tornar o Switch claramente visível em ambos os estados

### Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/profile/WhatsAppOptinSection.tsx` | Adicionar className ao Switch |

