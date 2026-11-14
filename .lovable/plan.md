# Efeito bolha nos cards "Acessar Cursos" e "Confira nossos Lançamentos"

Os dois cards ganham o mesmo visual de bolha de água dos atalhos: cor translúcida, reflexo branco no canto superior esquerdo e borda de vidro.

## Como fica
- **Cor:** em vez do branco, os dois cards usam a cor escolhida em Perfil → Aparência (hoje violeta), um pouco transparente.
- **Texto e setinha:** em branco; a setinha do "Acessar Cursos" vira a mesma bolhinha translúcida dos atalhos.
- **Mantido:** borda luminosa animada, sombra suave, personagem encostado embaixo e texto centralizado.

## Detalhes técnicos
- `src/pages/Index.tsx`: nos dois cards, trocar `bg-card text-card-foreground border-border` por `feature-bubble` + fundo `color-mix(in srgb, var(--user-glow-color) 75%, transparent)` (via estilo inline ou classe `.bubble-user` em `src/index.css`) e texto `text-feature-foreground`; círculo da seta com `border-feature-foreground/40 bg-feature-foreground/20 backdrop-blur`.
- Garantir que o `border-beam` continue por cima do reflexo (`::before` do `.feature-bubble`).
