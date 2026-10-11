# Border beam animado nos cards com brilho

## O que será feito
Todo card que hoje tem a sombra colorida (o brilho escolhido em Perfil → Aparência) ganha uma **linha de luz animada correndo pela borda**, na mesma cor do brilho selecionado. Ao trocar a cor no seletor, a linha muda na hora junto com a sombra.

## Como funciona (resumo)
- A sombra dos cards é aplicada pelo componente `GlassCard` (usado na tela inicial: card do vídeo, "Acessar Cursos", "Confira nossos Lançamentos"). O feixe de luz entra dentro dele, então todos esses cards recebem o efeito de uma vez.
- A cor do feixe vem da mesma preferência que já controla a sombra (`--user-glow`), por isso acompanha a escolha do usuário automaticamente.

## Mudanças técnicas

1. **`src/contexts/ThemePreferencesContext.tsx`**
   - `applyGlowCssVars` passa a gravar também `--user-glow-color` com a cor cheia (sem transparência), além das variáveis atuais de sombra.

2. **`src/index.css`**
   - Fallback de `--user-glow-color` no `:root` (verde neon padrão).
   - Novo utilitário `.border-beam`: elemento absoluto cobrindo o card, com `border-radius: inherit`, fundo `conic-gradient` que vai de transparente até a cor do brilho, mascarado para pintar só o anel da borda (~1.5px) e animação girando 360° em ~4s em loop.
   - `@property --beam-angle` registrado para o gradiente girar; navegadores antigos ficam com a borda estática colorida (degradação graciosa).

3. **`src/components/GlassCard.tsx`**
   - Card recebe `relative overflow-hidden` e renderiza `<span aria-hidden className="border-beam" />`; `pointer-events: none` para não atrapalhar toques.

## O que não muda
- Cores dos 9 cards da tela inicial, menu, textos, navegação e a lógica do seletor de cores do Perfil.

## Validação
- Build sem erros e conferência visual na prévia: feixe correndo na borda dos três cards da home, mudando de cor ao trocar a preferência.
- Para chegar ao celular: publicar + live update (canal Production) e reabrir o app.
