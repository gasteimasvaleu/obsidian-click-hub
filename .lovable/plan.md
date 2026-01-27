

## Player de Música com Playlist para Audiofy

### Visão Geral

Criar um player de áudio persistente na página Audiofy que permite ao usuário selecionar múltiplas músicas e tocá-las como uma playlist, com controles completos de reprodução.

### Funcionalidades

**Player Principal (fixo na parte inferior)**
- Barra de progresso clicável/arrastável
- Botões de controle: anterior, play/pause, próxima
- Exibição da música atual (título + artista/descrição)
- Indicador de tempo atual / tempo total
- Controle de volume
- Botão de shuffle (ordem aleatória)
- Botão de repeat (repetir playlist/música)

**Lista de Músicas**
- Cada música mostra ícone de play ao lado
- Indicador visual da música atual tocando
- Clique em qualquer música adiciona à fila ou toca imediatamente
- Animação de ondas sonoras na música em reprodução

### Arquitetura

```
src/
├── components/
│   └── audiofy/
│       ├── AudioPlayer.tsx        # Player principal com controles
│       ├── PlaylistQueue.tsx      # Lista de músicas na fila (opcional)
│       └── SongItem.tsx           # Componente individual de música
└── pages/
    └── Audiofy.tsx                # Página atualizada
```

### Interface do Player

```text
┌─────────────────────────────────────────────────────────────┐
│  🎵 Nome da Música                              0:45 / 3:22 │
│  ────────────●──────────────────────────────────            │
│                                                             │
│     🔀     ⏮️     ▶️     ⏭️     🔁     🔊━━━●━━━━           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Estados Gerenciados

- `playlist`: Array de músicas selecionadas
- `currentIndex`: Índice da música atual na playlist
- `isPlaying`: Se está tocando
- `currentTime`: Tempo atual de reprodução
- `duration`: Duração total da música
- `volume`: Volume (0-1)
- `shuffle`: Modo aleatório ativo
- `repeat`: Modo de repetição ('none' | 'all' | 'one')

### Fluxo de Uso

1. Usuário entra na página e vê lista de músicas
2. Clica em uma música - player aparece e começa a tocar
3. Pode clicar em outras músicas para adicionar à fila ou tocar imediatamente
4. Player fica fixo na parte inferior enquanto navega pela lista
5. Controles permitem pular, pausar, ajustar volume e progresso

---

### Detalhes Técnicos

#### 1. Novo Componente `AudioPlayer.tsx`

**Localização:** `src/components/audiofy/AudioPlayer.tsx`

Componente que encapsula toda a lógica do player:
- Usa um único elemento `<audio>` com ref
- Gerencia eventos: `onTimeUpdate`, `onEnded`, `onLoadedMetadata`
- Barra de progresso usando o componente `Slider` já existente
- Controle de volume também com `Slider`
- Animação de fade-in quando aparece

**Props principais:**
```typescript
interface AudioPlayerProps {
  playlist: Track[];
  currentIndex: number;
  onTrackChange: (index: number) => void;
  onClose?: () => void;
}

interface Track {
  id: string;
  title: string;
  description: string;
  file_url: string;
  duration: number | null;
  thumbnail_url: string | null;
}
```

#### 2. Novo Componente `SongItem.tsx`

**Localização:** `src/components/audiofy/SongItem.tsx`

Componente para exibir cada música na lista:
- Indicador visual quando é a música tocando (animação de ondas)
- Botão de play que aparece no hover
- Badge de duração

#### 3. Atualização da Página `Audiofy.tsx`

**Mudanças:**
- Filtrar apenas itens com `content_type === 'audiobook'` (músicas)
- Adicionar estado para playlist e índice atual
- Renderizar `AudioPlayer` fixo no bottom quando há música selecionada
- Adicionar padding-bottom extra quando player está visível

**Lógica de seleção:**
```typescript
const handleSelectTrack = (track: Track, index: number) => {
  setPlaylist(audioTracks); // Todas as músicas
  setCurrentIndex(index);
};
```

#### 4. Estilos do Player

O player terá visual consistente com o tema futurístico:
- Background glass effect
- Cores primary (verde neon)
- Bordas arredondadas
- Sombra neon sutil
- Posição fixa no bottom da tela

### Compatibilidade Mobile

- Player responsivo que se adapta a telas menores
- Controles com tamanho touch-friendly
- Barra de progresso fácil de arrastar
- Volume pode ser ocultado em mobile (usar volume do device)

### Gamificação

Mantém a integração existente com `useUserProgress`:
- Registra atividade `music_listened` ao iniciar uma música
- Evita registrar múltiplas vezes a mesma música na mesma sessão

