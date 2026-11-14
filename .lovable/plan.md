# Cabeçalhos da Bíblia e do Guia para Pais iguais, também no computador

## O que muda
- **Bíblia:** o card branco "Bíblia Interativa", logo abaixo do vídeo, passa para o mesmo modelo do Guia para Pais. O título fica no card bolha violeta com a fonte grossa e "Interativa" em gradiente. O texto "Explore as Sagradas Escrituras…" fica no card branco colado embaixo.
- **Computador:** nas duas páginas, o vídeo, o título com o texto e o formulário do Guia ficam numa coluna centralizada com a mesma largura. Hoje, no computador, o vídeo é estreito e os cards abaixo ficam mais largos e desalinhados.
- Na Bíblia, a busca e as listas de livros continuam ocupando a largura normal.

## Detalhes técnicos
- `BibliaPage.tsx`: trocar o `GlassCard` das linhas 120–127 por `SectionHeader title="Bíblia Interativa" description="Explore as Sagradas Escrituras de forma interativa e organize seus estudos" className="mb-6"`, dentro de um wrapper `w-full max-w-2xl mx-auto`. O `GlassCard` do vídeo passa de `max-w-[500px]` para `max-w-2xl`.
- `GuiaPais.tsx`: o `GlassCard` do vídeo também passa para `max-w-2xl`, alinhado com o formulário, que já usa `max-w-2xl`.
- Conferir com capturas de tela em 393px e 1037px de largura.
