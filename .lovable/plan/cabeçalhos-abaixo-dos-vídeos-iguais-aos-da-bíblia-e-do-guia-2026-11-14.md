# Cabeçalhos abaixo dos vídeos iguais aos da Bíblia e do Guia, em todas as páginas principais

## O que muda
Em todas as páginas principais, exceto a Início, o card logo abaixo do vídeo passa para o mesmo modelo da Bíblia e do Guia para Pais. O título fica no card bolha violeta, com a fonte grossa e a última palavra em gradiente. O subtítulo fica no card branco colado embaixo.

No computador e no iPad, o vídeo, o cabeçalho e o conteúdo logo abaixo ficam numa coluna centralizada com a mesma largura. No celular, a aparência é a mesma das outras telas.

| Página | Título | Texto do card branco |
|---|---|---|
| Amigo Divino | Amigo Divino | Conexão espiritual e orientação para sua jornada |
| Bíbliafy | Bíbliafy | Músicas cristãs para crianças |
| Comunidade | Comunidade | Nenhum, só o título |
| Orações | Livrinho de Orações | Encontre a oração perfeita para cada momento |
| Jogos | Jogos & Quizzes | Aprenda a Bíblia brincando! |
| Colorir | Colorir Bíblico | Pinte desenhos bíblicos incríveis… |
| Devocional | Tema do dia | Data e referência bíblica do dia |

- **Amigo Divino:** o card "Orientação Espiritual" e o botão "Começar Jornada" continuam num card branco logo abaixo do cabeçalho.
- **Bíbliafy:** a lista de músicas continua num card branco logo abaixo do cabeçalho.

## Detalhes técnicos
- Em cada página, usar `SectionHeader` de `@/components/plataforma/CourseCarousel` dentro de `w-full max-w-2xl mx-auto`, no lugar do `<h1>` com gradiente e do `<p>` de subtítulo.
- O `GlassCard` do vídeo de cada página passa para `w-full max-w-2xl`, com `object-cover` no vídeo, igual à Bíblia e ao Guia.
- Arquivos: `AmigoDivino.tsx`, `Audiofy.tsx`, `Comunidade.tsx`, `Oracoes.tsx`, `Games.tsx`, `colorir/ColorirPage.tsx` e `devocional/DailyDevotionalPage.tsx`. Os pais flex de cada página ganham `w-full` onde for preciso, para a coluna não encolher no computador.
- Conferir em celular (393px), iPad (820px) e computador (1280px), na medida em que o login permitir.
