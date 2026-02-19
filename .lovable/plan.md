

# Remover Modal de Instalação PWA

Como o app agora é nativo, o modal que instrui o usuário a instalar o PWA não faz mais sentido.

## Arquivos a alterar

### 1. `src/pages/Index.tsx`
- Remover import do `PWAInstallModal`
- Remover import do `usePWAInstall`
- Remover os states e handlers relacionados (`showPWAModal`, `handlePWAInstall`, `handlePWAClose`)
- Remover o useEffect que exibe o modal
- Remover o componente `<PWAInstallModal />` do JSX

### 2. Arquivos a excluir
- `src/components/PWAInstallModal.tsx`
- `src/hooks/usePWAInstall.tsx`

Nenhuma outra parte do app referencia esses arquivos, então a remoção é segura.

