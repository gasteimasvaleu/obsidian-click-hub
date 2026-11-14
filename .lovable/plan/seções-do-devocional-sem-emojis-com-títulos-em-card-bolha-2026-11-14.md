# Seções do Devocional sem emojis, com títulos em card bolha

## O que muda
Os emojis saem dos títulos das 7 seções do Devocional. Cada título passa para o card bolha violeta, com borda luminosa, fonte grossa e a última palavra em gradiente. O conteúdo fica no card branco colado embaixo, no mesmo padrão dos Cursos, da Bíblia e do Guia para Pais.

Seções:
- Introdução
- Versículo do Dia
- Reflexão
- Para Refletir
- Aplicações Práticas
- Oração
- Minhas Anotações

O conteúdo de cada seção não muda. Isso inclui o versículo em destaque, a pergunta e a oração em itálico, o campo de anotações e os botões.

Os fundos coloridos de algumas seções, como o amarelo de "Para Refletir" e o roxo de "Oração", saem para tudo ficar uniforme.

## Detalhes técnicos
- `DailyDevotionalPage.tsx`: em cada seção, trocar `<GlassCard className="mb-6 ..."><h2>emoji Título</h2>…</GlassCard>` por um bloco `mb-6` com o cabeçalho bolha (`neon-glow-user feature-bubble bubble-user relative z-[2] rounded-2xl px-4 py-3` + `border-beam` + `<h2 className="bubble-title"><BubbleTitleText text="…" /></h2>`).
- Embaixo do cabeçalho vem um `GlassCard` com `-mt-4 pt-7 rounded-t-none`, encaixado no título como o `SectionDescription`, mantendo o conteúdo atual.
- Remover as classes `bg-yellow-500/5`, `bg-purple-500/5` e similares nessas seções.
