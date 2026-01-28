

## Visualizador de Ondas Sonoras / Equalizer Animado

### Objetivo

Adicionar um visualizador de ondas sonoras animado no player de música que reage ao estado de reprodução, criando uma experiência visual mais imersiva e futurista.

### Abordagem

Implementar um **equalizer visual com barras animadas** que:
- Aparece quando a música está tocando
- Cada barra oscila em velocidades diferentes para simular frequências de áudio
- Usa a cor neon verde primária do tema para manter a consistência visual

### Arquitetura

```text
┌─────────────────────────────────────────┐
│           Audio Player                  │
│  ┌─────────────────────────────────┐   │
│  │  [Ícone] Título & Descrição [X] │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │   ▐█▐ █▐ ▐█ █▐ ▐█▐ █ ▐█   │  │   │ ← Novo: Visualizador
│  │  └───────────────────────────┘  │   │
│  │  00:00 / 03:45                  │   │
│  └─────────────────────────────────┘   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ ← Progress Bar
│  [🔀]   [⏮] [▶/⏸] [⏭]   [🔁]         │
└─────────────────────────────────────────┘
```

### Mudanças Técnicas

**1. Novo Componente: `src/components/audiofy/AudioEqualizer.tsx`**

Criar componente reutilizável do equalizer com:
- 5-7 barras verticais animadas
- Animações CSS com delays diferentes para cada barra
- Props para controlar estado (ativo/inativo)
- Estilo que combina com o tema futurista

**2. Atualizar CSS: `src/index.css`**

Adicionar animações do equalizer:
- Keyframes para múltiplas barras com velocidades variadas
- Classes para barras individuais com delays diferentes
- Efeito de glow neon nas barras

**3. Integrar no AudioPlayer: `src/components/audiofy/AudioPlayer.tsx`**

- Importar o novo componente AudioEqualizer
- Adicionar o visualizador entre a seção de info e o tempo de reprodução
- Passar o estado `isPlaying` para controlar a animação

### Detalhes da Implementação

**AudioEqualizer.tsx:**
```tsx
// 7 barras com alturas e delays variados
// Animação suave que simula frequências de áudio
// Verde neon (#00FF66) com efeito glow
// Pausa a animação quando não está tocando
```

**Animações CSS:**
- `equalizer-bar-1` a `equalizer-bar-7`: velocidades de 0.3s a 0.6s
- Cada barra com `animation-delay` diferente
- `transform-origin: bottom` para crescer de baixo para cima

**Posicionamento:**
- Centralizado horizontalmente no player
- Altura de 20-24px
- Largura de cada barra: 3-4px
- Espaçamento entre barras: 2-3px
- Cantos arredondados

### Resultado Esperado

Quando uma música está tocando:
- 7 barras verdes neon oscilam em ritmos diferentes
- Efeito visual que simula um equalizador de áudio real
- As barras pausam quando a música é pausada
- Visual clean e futurista que combina com o design existente

