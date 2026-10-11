# Seletor de cor do brilho em carrossel (Perfil → Aparência)

## Objetivo
Substituir os dois botões fixos (Verde/Roxo) da seção Aparência por um **carrossel de cores** com as mesmas cores dos cards da tela inicial (Bíblia, Devocional, Orações, Bíbliafy, Colorir, Amigo Divino, Guia para Pais, Games, Comunidade), com **setas translúcidas** à esquerda e à direita para navegar.

## Como fica a tela
- O card "Aparência" mantém o título e ganha a descrição "Escolha a cor do brilho dos cards".
- No lugar da grade de 2 botões, um carrossel horizontal mostrando ~5 bolinhas de cor por vez.
- Setas esquerda/direita translúcidas (fundo branco/neon com baixa opacidade + blur), estilo consistente com o app; desabilitadas (esmaecidas) quando não há mais cores naquele lado.
- A bolinha selecionada fica com anel/glow da própria cor; tocar nela aplica o brilho imediatamente (mesmo comportamento atual).
- Cores do carrossel (11 opções): o Verde Neon atual (padrão do app, preserva quem já escolheu verde) + as 9 cores dos cards da home.

## Mudanças técnicas
1. `src/contexts/ThemePreferencesContext.tsx`
   - Tipo do `glowColor` deixa de ser só `'purple' | 'green'` e passa a ser o id de uma paleta exportada (`GLOW_PALETTE`), com 11 cores (id, nome, valor HSL — reutilizando os mesmos valores de `--feature-*` do `index.css`).
   - Migração automática de preferências salvas: `'green'` → `'neon'`, `'purple'` → `'devotional'` (ninguém perde a escolha).
   - Ao trocar a cor, grava no localStorage e atualiza a variável CSS `--user-glow` no `documentElement` (usada pelo brilho).

2. `src/index.css`
   - Nova variável `--user-glow` (padrão = verde neon atual) e classe única `.neon-glow-user` usando essa variável; classes antigas `.neon-glow-strong-green/purple` mantidas para não quebrar nada fora do GlassCard.

3. `src/components/GlassCard.tsx`
   - Usa a classe única `.neon-glow-user` (sombra `var(--user-glow)`); sombra de hover também via variável (definida junto em `--user-glow-hover`).

4. `src/components/profile/AppearanceSection.tsx`
   - Substitui a grade de botões pelo carrossel: janela visível com 5 swatches, setas translúcidas ChevronLeft/ChevronRight dos dois lados, seleção com anel da cor escolhida. Sem libs novas — carrossel por índice/offset simples.

## Validação
- Build OK e conferência visual no preview (/profile): carrossel navega com as setas, cor selecionada aplica o glow nos GlassCards em tempo real e persiste ao recarregar.
- Não altera nada nativo — vai ao celular por live update depois de publicar.
