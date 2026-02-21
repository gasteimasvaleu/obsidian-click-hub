

# Transicoes de Pagina Animadas + Skeleton Loading Padronizado

## 1. Transicoes de Pagina Animadas

Criar um componente `AnimatedRoutes` que usa `framer-motion` (`AnimatePresence` + `motion.div`) para animar a transicao entre rotas com fade + slide sutil (~200ms).

### Arquivos

| Arquivo | Acao |
|---------|------|
| `src/components/AnimatedRoutes.tsx` | Criar: componente que usa `useLocation` + `AnimatePresence` + `motion.div` para envolver todas as `<Routes>` |
| `src/App.tsx` | Editar: extrair o bloco de `<Routes>` para dentro de `<AnimatedRoutes>` |

### Abordagem
- Usar `useLocation()` como key do `motion.div` para que o framer-motion detecte a mudanca de rota
- Animacao: fade-in com leve translateY (de 8px para 0) na entrada, duracao ~200ms
- Nao animar a saida (exit) para evitar flash/sobreposicao -- apenas entrada suave

---

## 2. Skeleton Loading Padronizado

Substituir spinners `Loader2` e textos "Carregando..." por skeletons que simulam o layout final da pagina.

### Novos componentes skeleton

| Arquivo | Descricao |
|---------|-----------|
| `src/components/skeletons/DevotionalSkeleton.tsx` | Simula: video banner + card de tema + cards de secao (introducao, versiculo, reflexao) |
| `src/components/skeletons/PostCardSkeleton.tsx` | Simula: avatar + nome + texto + barra de acoes de um post |
| `src/components/skeletons/DrawingCardSkeleton.tsx` | Simula: imagem quadrada + titulo + botao (ja existe inline no ColorirPage, vou extrair) |
| `src/components/skeletons/GamePlayerSkeleton.tsx` | Simula: area de jogo com placeholder |
| `src/components/skeletons/ColoringEditorSkeleton.tsx` | Simula: header + canvas + toolbar |

### Paginas editadas

| Pagina | Mudanca |
|--------|---------|
| `src/pages/devocional/DailyDevotionalPage.tsx` | Substituir `Loader2` spinner pelo `DevotionalSkeleton` |
| `src/pages/Comunidade.tsx` | Substituir `Loader2` spinner por 3x `PostCardSkeleton` |
| `src/pages/games/GamePlayer.tsx` | Substituir texto "Carregando jogo..." por `GamePlayerSkeleton` |
| `src/pages/colorir/ColoringEditorPage.tsx` | Substituir `Loader2` spinner por `ColoringEditorSkeleton` |

Nota: `ColorirPage.tsx` ja tem skeleton inline -- vou manter como esta pois ja funciona bem.

---

## Resumo

- **5 novos arquivos** de skeleton + 1 novo `AnimatedRoutes`
- **5 arquivos editados** (App.tsx + 4 paginas com loading)
- Usa `framer-motion` ja instalado no projeto
- Usa `Skeleton` de `@/components/ui/skeleton` ja existente

