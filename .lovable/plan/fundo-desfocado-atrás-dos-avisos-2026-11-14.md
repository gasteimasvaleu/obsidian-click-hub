# Fundo desfocado atrás dos avisos

## O que muda
Hoje, quando um aviso abre (como o de Inteligência Artificial), a tela de trás fica totalmente preta. Ela passa a aparecer desfocada, com um leve véu claro, e continua dando para ver as cores da página por trás.

Isso vale para todos os avisos e janelas do app que usam o mesmo modelo, para manter tudo padronizado.

## Detalhes técnicos
- `src/components/ui/dialog.tsx`, `DialogOverlay`: trocar `bg-black` por `bg-background/30 backdrop-blur-md`.
