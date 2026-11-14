# Tema claro violeta e cards bolha em todo o app

Levar o visual da tela inicial (fundo cinza clarinho/branco, violeta, cards com efeito bolha, borda luminosa e sombra suave) para todas as telas: Cursos e aulas, Bíblia, Guia Pais, Amigo Divino, Devocional, Orações, Bíbliafy, Colorir, Games, Comunidade, Perfil, Sobre, Termos, Política, Login/Cadastro e o painel Mais/menu de baixo. As imagens atuais ficam; você vai trocando depois.

## O que muda para você
- Fundo claro e textos escuros em todas as páginas; destaques e botões em violeta.
- Barra de cima com a logo e o menu de três pontinhos que abre para a esquerda em todas as telas.
- Menu de baixo claro em todas as telas (hoje só na inicial).
- Cards e botões principais com o mesmo efeito bolha (translúcido, brilho no canto superior esquerdo, borda luminosa e sombra suave), mantendo as cores de cada seção.
- O seletor de cor do Perfil continua funcionando na borda e na sombra.

## Fora do escopo
- Painel Admin continua escuro (uso interno).
- Player de vídeo e tela de colorir mantêm fundo escuro onde ajuda a visualização.

## Detalhes técnicos
- Promover os tokens de `.home-light` para `:root` em `src/index.css` (fundo, card, popover, borda, muted, primary violeta), mantendo o escuro só sob `.admin-dark`.
- `.feature-bubble` + `.bubble-user` passam a ser aplicados globalmente: `GlassCard` recebe o efeito bolha por padrão; regras `.home-light .neon-glow-user*` viram globais.
- `tubelight-navbar.tsx`: `light` sempre ativo (remove condição `pathname === "/"`); `FuturisticNavbar light` em todas as páginas que usam a barra.
- Varredura das páginas trocando cores fixas do tema escuro (`bg-black`, `text-white`, `bg-zinc-*`, verde neon) por tokens semânticos.
- Atualizar regra em `AGENTS.md` sobre escopo do tema claro e checar com Playwright as principais telas logado.
