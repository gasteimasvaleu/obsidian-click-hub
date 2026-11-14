# Voltar a borda luminosa e a sombra colorida

Os cards que tinham borda luminosa animada e sombra na cor escolhida no Perfil voltam a ter esse efeito na tela inicial clara.

## O que muda
- **Vídeo do topo:** volta a ficar dentro de um card com borda luminosa e sombra colorida.
- **Card "Acessar Cursos":** ganha de novo a borda luminosa e a sombra colorida (mantendo o personagem encostado embaixo e o texto centralizado).
- **"Confira nossos Lançamentos":** o título volta a ser um card com borda luminosa e sombra.
- Os cards coloridos de atalho continuam como estão.

## Detalhes técnicos
- Em `src/pages/Index.tsx`, adicionar `neon-glow-user` e um `<span aria-hidden className="border-beam" />` ao botão de cursos e envolver o vídeo e o título dos lançamentos com o mesmo tratamento (ou `GlassCard`), mantendo o fundo claro (`bg-card`) da home.
- A cor continua vindo da escolha de Aparência do Perfil.
