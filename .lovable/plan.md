# Mesma largura em todas as páginas, seguindo a Bíblia

## Problema
No computador e no tablet, cada página usa uma largura diferente. A Bíblia é a referência: fica numa coluna central com margem lateral fixa. A Plataforma ocupa a tela inteira, e por isso o vídeo fica enorme e a página fica comprida demais. O Guia para Pais, o Devocional, a Comunidade, o Amigo Divino, o Bíbliafy, o Colorir e o Perfil ficam mais estreitos ou mais largos que a Bíblia.

## O que muda
- Todas as páginas de usuário passam a ter a mesma coluna central e a mesma margem lateral da Bíblia: Plataforma (com curso, módulo e aula), Guia para Pais, Orações, Games, Amigo Divino, Bíbliafy, Comunidade, Colorir, Devocional, Perfil, Sobre, Termos e Política.
- Em cada página, o vídeo do topo, o card de título e o conteúdo abaixo ficam com a mesma largura, alinhados pelas bordas.
- No celular nada muda, porque a margem continua a mesma.
- Telas de jogo em andamento, como caça-palavras e quebra-cabeça, e o editor de colorir continuam como estão, porque precisam de espaço.

## Detalhes técnicos
- Criar `src/components/PageContainer.tsx`, que aplica `container mx-auto px-4 max-w-4xl`, e usar esse componente como contêiner externo em cada página da lista.
- Dentro dele, trocar os limites internos `max-w-2xl`, `max-w-3xl` e `max-w-6xl` do vídeo, do `SectionHeader` e dos blocos de conteúdo por `w-full`.
- `PlataformaLayout`: envolver `children` no `PageContainer` e tirar o `px-4` duplicado dos carrosséis e do `SectionHeader`. Na aula, a lista lateral `w-80` continua no `lg`.
- Registrar a regra no AGENTS.md: a largura das páginas vem do `PageContainer`.
