# Ícones ilustrados e coloridos no menu "Mais"

Ótima ideia para o público infantil: ilustrações coloridas são mais fáceis de reconhecer que ícones de traço, e deixam o menu com cara de app de criança. Só o painel "Mais" muda; a barra de baixo continua igual.

## Como fica
- Cada botão do painel ganha uma ilustração 2D colorida, sem fundo, no estilo desenho animado (traço arredondado, cores vivas, mesmo estilo em todas), com o nome embaixo como hoje.
- Ilustrações (11), uma por item:

| Item | Ilustração |
|---|---|
| Amigo Divino | balão de conversa fofo com um pequeno anjinho |
| Devocional | coração vermelho com raios de luz |
| Orações | mãos postas em oração |
| Bíbliafy | nota musical colorida com fones |
| Colorir | lápis de cor e paleta |
| Games | controle de videogame |
| Comunidade | três criancinhas sorrindo juntas |
| Meu Perfil | carinha de criança sorridente |
| Sobre | balão com letra "i" |
| Política Família | escudo com coração e família |
| Termos de Uso | folha de papel com caneta |

- Tamanho maior que os ícones atuais (cerca de 44px), com um leve "pulinho" ao tocar.
- Item da página atual continua com fundo destacado suave.

## Detalhes técnicos
- Gerar as 11 imagens com fundo transparente em `src/assets/more-menu/*.png` (mesmo prompt de estilo para consistência) e importá-las como imagens.
- `src/components/ui/tubelight-navbar.tsx`: trocar o campo `icon` de `moreMenuItems` por `image`, renderizar `<img alt="" className="h-11 w-11 object-contain">` no lugar do ícone Lucide.
