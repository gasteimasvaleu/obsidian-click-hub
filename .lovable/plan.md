# Trocar a imagem do topo deste curso

A imagem do topo da página do curso (id f98a734c...) vem do cadastro do curso, não do código.

## Passos
1. Enviar a imagem nova para o armazenamento público do app.
2. Atualizar o cadastro deste curso para usar a nova imagem (imagem da página e banner no computador), assim o celular também passa a mostrar a nova.
3. Ajustar o formato do card do topo para o formato da imagem nova (1672x941, quase 16:9), apenas neste curso, para não cortar.

## Detalhes técnicos
- Upload no bucket `criativos`; UPDATE em `courses.page_image_desktop` e `banner_desktop` onde id = f98a734c-e35f-4bc8-97fb-9d51c7c702c1.
- Em CoursePage, calcular o aspectRatio a partir das dimensões reais da imagem carregada (fallback 1440/730), para que nenhuma imagem fique cortada.
