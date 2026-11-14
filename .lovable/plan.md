# Trocar o vídeo do topo da página Cursos

## O que muda
- O vídeo do card 16:9 no topo da página Cursos passa a ser o vídeo enviado, no celular e no computador.
- As páginas de cada curso e de cada módulo continuam com os vídeos atuais.

## Detalhes técnicos
- Subir o arquivo enviado via lovable-assets → `src/assets/plataforma_hero_video.mp4.asset.json`.
- `PlataformaPage.tsx`: passar `videoDesktop`/`videoMobile` = `heroVideo.url` e `useVideo` = true no `ResponsiveHeroBanner`, no lugar dos valores vindos das configurações do painel.
