# Títulos e subtítulos das seções na página de Cursos

Ótima ideia, combina com a tela inicial. Cada seção de cursos ganha um cabeçalho em dois cards bolha encaixados, no estilo de cartas:

```text
 ( Título da seção            )   <- card bolha violeta (cor do Perfil), texto branco
 (  Subtítulo curto... Ver mais )  <- card bolha branco, colado embaixo, texto escuro
```

- **Título:** card bolha violeta com borda luminosa e sombra suave, igual ao "Confira nossos Lançamentos".
- **Subtítulo:** card bolha branco translúcido, encaixado logo abaixo do título (sobrepõe um pouco, como as cartas da tela inicial).
- **Limite:** o subtítulo mostra até cerca de 90 caracteres e termina em "…". Um link violeta "Ver mais" abre o texto completo, e "Ver menos" fecha.
- Se a seção não tiver subtítulo, aparece só o card do título.
- Vale para todas as seções da página de Cursos (destaques e listas de cursos).

## Detalhes técnicos
- `src/components/plataforma/CourseCarousel.tsx`: trocar `h2`/`p` por card `neon-glow-user feature-bubble bubble-user relative rounded-2xl` (com `border-beam`, `text-feature-foreground`) e, abaixo, card `glass feature-bubble -mt-3 rounded-b-2xl pt-5` com estado `expanded`, limite de 90 caracteres e botão "Ver mais/Ver menos" em `text-primary`.
