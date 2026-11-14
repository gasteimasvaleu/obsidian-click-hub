# Remover emojis de todos os textos do app

## O que muda
- **Textos que vêm do painel** (descrições e títulos de cursos, módulos e aulas, títulos de seção, devocionais etc.): o app passa a esconder automaticamente os emojis na hora de mostrar. Vale para o que já existe e para o que for cadastrado depois, sem precisar editar nada no painel.
- **Textos fixos do app**: removo os emojis de títulos, avisos e mensagens em cerca de 25 telas (devocional, histórico do perfil, games, Colorir, Guia para Pais, aviso de IA, cadastro, Bíbliafy, entre outras).
- Ícones desenhados (setas, play, check) continuam, porque não são emojis.
- O painel de administração não muda: os emojis continuam salvos lá, só não aparecem no app.

## Detalhes técnicos
- Novo `src/lib/stripEmoji.ts`: regex Unicode (`\p{Extended_Pictographic}`, seletor de variação FE0F, ZWJ e bandeiras), limpando espaços duplos e nas pontas.
- Aplicar em `BubbleTitleText`, `SectionHeader`/`SectionDescription`, `ModulePlaylist`, `LessonPlaylist`, no título do carrossel, no devocional (`DailyDevotionalPage`, `DevotionalDetailModal`, `DevotionalCard`) e no `GuideDisplay`.
- Remover os emojis literais dos arquivos `.tsx` encontrados na varredura, fora de `src/pages/admin`. Os `console.log` de `main.tsx` também saem, sem efeito visível.
- Teste em `src/lib/stripEmoji.test.ts`: "Criação 🌍 do Mundo ✨" vira "Criação do Mundo", e um texto sem emoji não muda.
