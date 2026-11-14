# Menu do topo abrindo para a esquerda, dentro da barra

O botão de três pontinhos continua no canto direito, mas ao tocar ele se estica **para a esquerda, na mesma linha da barra superior**, como no código enviado. As opções aparecem lado a lado, só com os ícones (o nome aparece ao segurar/passar o mouse), sem descer sobre a tela.

```text
 [logo]            ( Perfil  Admin  Sobre  Sair  ⋮ )
```
- Os ícones entram um a um com a animação de mola; o botão dos pontinhos gira ao abrir.
- "Sair" continua em vermelho; deslogado aparece "Entrar".
- A pílula aberta fica na altura da barra, sem cobrir a logo.

## Detalhes técnicos
- `src/components/ui/expand-menu.tsx`: voltar ao comportamento original de direções (`up/down/left/right`, `anchorStyle`, `triggerLast`, `flexDirMap`), mantendo `framer-motion`, lucide e a opção `className` por item.
- `src/components/FuturisticNavbar.tsx`: usar `<ExpandMenu direction="left" items={...} />` sem `showLabels` (rótulo vai em `title`/`aria-label`).
