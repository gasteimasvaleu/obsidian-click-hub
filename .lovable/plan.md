

# Usar nome curto "Guia Pais" quando selecionado na navbar

## O que muda

Adicionar um campo opcional `shortName` ao `NavItem` para que itens com nomes longos possam exibir uma versao mais curta quando ativos na navbar, evitando que o menu fique apertado.

## Alteracoes

### 1. `src/components/ui/tubelight-navbar.tsx`
- Adicionar `shortName?: string` na interface `NavItem`
- Na linha que exibe `{item.name}`, trocar para `{item.shortName || item.name}` (usa o nome curto se existir, senao usa o nome completo)

### 2. `src/App.tsx`
- No item "Guia para Pais" do array `navItems`, adicionar `shortName: 'Guia Pais'`

```text
Antes:  { name: 'Guia para Pais', url: '/guia-pais', icon: Users }
Depois: { name: 'Guia para Pais', url: '/guia-pais', icon: Users, shortName: 'Guia Pais' }
```

Assim o texto "Guia Pais" aparece quando selecionado, mantendo o menu confortavel sem comprimir os outros itens.

