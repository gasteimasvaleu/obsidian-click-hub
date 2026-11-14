# Menu expansível no canto superior direito

Os ícones soltos do alto da tela (Perfil, Painel Admin, Sair/Entrar e Sobre) viram um único botão redondo com três pontinhos. Ao tocar, ele se abre para baixo com uma animação suave, mostrando cada opção com ícone e nome. O botão gira e vira um "x" para fechar; tocar fora também fecha.

## Como fica
```text
                                   ( ⋮ )
   ao tocar ->                 ┌──────────────┐
                               │  ( x )       │
                               │  Meu Perfil  │
                               │  Painel Admin│  (só para administradores)
                               │  Sobre       │
                               │  Sair        │  (ou "Entrar" se deslogado)
                               └──────────────┘
```
- Fundo branco com borda e sombra leves na tela inicial clara; nas telas escuras, segue o tema escuro.
- "Sair" aparece em vermelho para não ser tocado sem querer.
- A logo à esquerda continua igual.

## Detalhes técnicos
- Criar `src/components/ui/expand-menu.tsx` com o componente enviado, adaptado para usar `framer-motion` (já instalado, em vez de `motion`) e ícones `lucide-react` (sem instalar `hugeicons-react`); adicionar alinhamento à direita na direção "down" para não sair da tela.
- `src/components/FuturisticNavbar.tsx`: substituir o bloco de ícones por `<ExpandMenu direction="down" showLabels items={...} />`, montando os itens conforme `user`/`isAdmin` (navegação via `useNavigate`, logout via `signOut`).
- Cores apenas por tokens (`bg-popover`, `text-muted-foreground`, `text-destructive`).
