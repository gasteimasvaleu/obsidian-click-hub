# Toque no "Acessar Cursos" em violeta mais escuro

Ao passar o dedo ou tocar no card "Acessar Cursos", ele deixa de ficar quase branco e passa a ficar num violeta um pouco mais escuro que o normal. Texto, reflexo, borda luminosa e sombra continuam iguais.

## Detalhes técnicos
- O botão usa a variante `ghost`, cujo `hover:bg-accent` (violeta clarinho) sobrepõe o fundo da bolha.
- Em `src/pages/Index.tsx`, adicionar ao botão `hover:bg-transparent` para anular o accent, e em `src/index.css` definir `.bubble-user:hover { background-color: color-mix(in srgb, var(--user-glow-color) 85%, black 15%); }` (versão mais escura da cor escolhida no Perfil, hoje violeta).
