# Topo da página de Cursos no padrão da tela inicial

**Minha opinião:** trocar pelo vídeo 16:9 em card, igual à tela inicial. Três motivos:
- O vídeo de fundo foi feito para o tema escuro. A faixa preta que escurece a parte de baixo fica estranha agora que o fundo é claro.
- O texto longo por cima do vídeo cobre os personagens e fica difícil de ler no celular.
- As duas telas principais ficam com a mesma cara.

## Como fica
```text
 ( vídeo 16:9 em card arredondado, borda luminosa + sombra )
 ( Título em card bolha violeta                            )
 ( Subtítulo em card bolha branco... Ver mais              )
 [ carrosséis de cursos ]
```
- O vídeo atual continua sendo usado, só muda o formato. Ele é recortado ao centro para 16:9 e fica dentro de um card com o mesmo recuo lateral dos carrosséis. Se quiser, depois você manda um vídeo já em 16:9.
- O título e o texto saem de cima do vídeo e vão para baixo dele, nos mesmos cards bolha das seções (violeta e branco, com "Ver mais").
- A faixa escura sobre o vídeo é removida.

## Detalhes técnicos
- `src/components/plataforma/ResponsiveHeroBanner.tsx`: na página de Cursos, renderizar `AspectRatio 16/9` dentro de `neon-glow-user relative overflow-hidden rounded-2xl` com `border-beam`, sem `bottomGradient`/overlay; título e descrição abaixo reaproveitando o cabeçalho de seção do `CourseCarousel` (extrair `SectionHeader` para reutilizar).
- `src/pages/plataforma/PlataformaPage.tsx`: passar as props novas e aplicar o mesmo recuo lateral dos carrosséis. As páginas de curso, módulo e aula não mudam.
