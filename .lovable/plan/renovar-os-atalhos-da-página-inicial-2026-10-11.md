# Renovar os atalhos da página inicial

## Página inicial
- Manter o vídeo de abertura e o botão **Acessar Cursos** como estão.
- Mover o carrossel **Confira nossos Lançamentos** para logo abaixo de **Acessar Cursos**.
- Substituir a grade atual por quatro cards grandes e empilhados, inspirados no screenshot:
  1. **Bíblia Interativa**
  2. **Devocional Diário**
  3. **Orações**
  4. **Bíbliafy**
- Cada card terá cor própria, ícone, título, pequenos rótulos relacionados e um botão circular com seta.
- Usar leve sobreposição vertical e cantos arredondados para reproduzir o ritmo visual da referência, mantendo o fundo escuro e a identidade neon do BíbliaToon Club.
- Preservar o comportamento atual de abrir cada área ao tocar no card inteiro.

## Menu inferior Tubelight
- Deixar os cinco acessos principais nesta ordem:
  1. **Início**
  2. **Colorir**
  3. **Amigo Divino**
  4. **Guia para Pais**
  5. **Games**
  6. **Mais**
- Ajustar o tamanho e os nomes exibidos para os seis itens caberem corretamente em celulares, sem sobreposição.

## Menu “Mais”
- Remover os itens que agora aparecem nos cards ou diretamente no menu inferior.
- Manter dentro de **Mais**:
  - **Comunidade**
  - **Meu Perfil**
  - **Sobre**
  - **Política Família**
  - **Termos de Uso**

## Validação
- Conferir a página inicial em largura de iPhone, incluindo a safe area inferior.
- Verificar abertura dos quatro cards, dos cinco atalhos diretos e de todos os itens em **Mais**.
- Confirmar que textos, ícones e menu não se sobrepõem e que a página continua rolando até o final.

## Detalhes técnicos
- Alterar a composição da página inicial em `src/pages/Index.tsx`.
- Atualizar os itens principais em `src/App.tsx` e os itens secundários em `src/components/ui/tubelight-navbar.tsx`.
- Criar tokens semânticos para as quatro cores dos cards no tema global, evitando cores soltas nos componentes.
- Atualizar a regra persistente da estrutura de navegação para refletir a nova distribuição.
