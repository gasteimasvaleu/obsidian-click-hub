# Cards da tela inicial: sem etiquetas e com mais 4 atalhos

## O que muda

- As etiquetas ("73 livros", "Leitura", "Músicas", "Histórias" etc.) saem dos cards. Cada card passa a mostrar só o ícone, o nome e o botão de seta.
- Entram 4 novos cards, na mesma lista, logo depois dos atuais: Colorir, Amigo Divino, Guia para Pais e Games. A tela inicial fica com 8 atalhos.
- Cada card encolhe: de 144px para cerca de 88px de altura, mantendo folga para tocar com conforto. Os cards continuam levemente sobrepostos um sobre o outro.
- Cada um dos 4 novos cards ganha a própria cor, no mesmo estilo das 4 cores que já existem.

## Ordem na tela

1. Vídeo de destaque
2. Acessar Cursos
3. Confira nossos Lançamentos
4. Cards: Bíblia Interativa, Devocional Diário, Orações, Bíbliafy, Colorir, Amigo Divino, Guia para Pais, Games

## Passos

1. Em `src/pages/Index.tsx`: apagar o campo de etiquetas dos 4 itens existentes e o trecho que desenha as etiquetas dentro do card; encolher a altura do card e ajustar o espaçamento interno e a sobreposição entre eles.
2. Ainda em `src/pages/Index.tsx`: acrescentar os 4 novos itens à mesma lista, apontando para `/colorir`, `/amigodivino`, `/guia-pais` e `/games`, com os ícones já usados no menu de baixo (paleta, robô, pessoas, controle de jogos), e importar esses ícones.
3. Em `src/index.css`: criar as 4 novas cores (uma por card novo) tanto no tema claro quanto no escuro.
4. Em `tailwind.config.ts`: registrar as 4 novas cores para que possam ser usadas nos cards.
5. Atualizar a memória da navegação para refletir os 8 cards da tela inicial.

## Detalhes técnicos

- Os cards continuam sendo conteúdo da própria página inicial; o menu inferior e o menu "Mais" não mudam, então Colorir, Amigo Divino, Guia para Pais e Games seguem aparecendo nos dois lugares.
- Cores propostas (podem ser ajustadas depois): Colorir em ciano, Amigo Divino em verde-esmeralda, Guia para Pais em laranja e Games em verde-lima.
- O botão redondo de seta fica um pouco menor (de 56px para 48px) para acompanhar a nova altura.

## Verificação

- Compilação sem erros.
- Tela inicial mostra os 8 cards, sem nenhuma etiqueta, com as cores corretas e sem sobra de espaço vazio.
- Tocar em cada um dos 4 cards novos abre a tela correspondente.
