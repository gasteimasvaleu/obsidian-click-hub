# Completar o menu "Mais" e igualar as cores ao menu tubelight

## Contexto atual (verificado)
- Menu principal (tubelight): Início, Cursos, Amigo Divino, Guia para Pais, Colorir, Mais — definido em `src/App.tsx`.
- Menu "Mais" (`moreMenuItems` em `src/components/ui/tubelight-navbar.tsx`): Comunidade, Meu Perfil, Sobre, Política Família, Termos de Uso.
- Rotas de topo que não estão no menu principal e não estão no "Mais": `/biblia`, `/devocional`, `/oracoes`, `/audiofy` (Bíbliafy), `/games`.
- Cores: os itens do tubelight usam `text-primary/80 hover:text-primary` (ativo: `bg-primary/10 text-primary`); os itens do painel "Mais" usam `text-foreground/70 hover:text-foreground` (ativo: `bg-primary/15`), por isso parecem "apagados" em relação ao menu principal.

## Mudanças

### 1. `src/components/ui/tubelight-navbar.tsx` — novos itens no menu "Mais"
Adicionar às `moreMenuItems`, com ícones já usados nos cards da home:
- Bíblia (`/biblia`, BookOpen)
- Devocional Diário (`/devocional`, Sunrise ou CalendarDays — ícone já usado no card)
- Orações (`/oracoes`, HandHeart — ícone já usado no card)
- Bíbliafy (`/audiofy`, Music — ícone já usado no card)
- Games (`/games`, Gamepad2)

Ordem final do painel (10 itens, grid-cols-3 como hoje):
Bíblia, Devocional Diário, Orações, Bíbliafy, Games, Comunidade, Meu Perfil, Sobre, Política Família, Termos de Uso.

Rotas de detalhe (`/biblia/:bookId`, `/plataforma/aula/...`, editores de colorir, rotas `/admin`) continuam fora do menu — só destinos de topo entram.

### 2. Mesmo arquivo — cores dos itens do painel iguais às do tubelight
Trocar as classes dos botões do painel "Mais":
- Inativo: `text-primary/80 hover:text-primary` (era `text-foreground/70 hover:text-foreground`); remover `hover:bg-muted/60`.
- Ativo (página atual): `bg-primary/10 text-primary` com o mesmo brilho do menu principal (`shadow-[0_0_12px_-2px_hsl(var(--primary)/0.4)]`).

Assim os itens do "Mais" ficam no mesmo verde neon (ou roxo, se o tema glow estiver alternado) do menu inferior.

### 3. Documentação
- Atualizar `mem://features/navigation-items-structure` (menu Mais passa a ter os 10 itens).
- Atualizar `roadmap.md`.

## Arquivos alterados
- `src/components/ui/tubelight-navbar.tsx` (itens + cores)
- `mem://features/navigation-items-structure`, `roadmap.md`

## Validação
- Build sem erros; conferir na prévia que o painel "Mais" abre com os 10 atalhos, todos em verde neon, e que o item da página atual aparece destacado.
- Para chegar ao celular: publicar + live update (canal Production), fechar e reabrir o app.
