

## Adicionar Roxo Neon nas Sombras dos Cards

### Conceito

Manter a identidade visual atual (verde neon nos menus, botões e elementos interativos) e adicionar um toque de roxo neon nas sombras dos cards, criando uma combinação futurista elegante.

### Cor Roxo Neon

Baseado no screenshot que você enviou, vou usar um roxo/magenta neon:
- **HSL**: `280 100% 65%` (roxo vibrante)
- **RGBA para glow**: `rgba(180, 50, 255, 0.4)`

### Mudanças Técnicas

#### 1. Atualizar Variáveis CSS

**Arquivo:** `src/index.css`

Adicionar nova variável para o glow roxo dos cards:

```css
--neon-glow: rgba(0, 255, 102, 0.4);        /* Verde - mantém para menus */
--neon-glow-purple: rgba(180, 50, 255, 0.4); /* Roxo - novo para cards */
```

#### 2. Atualizar Classe de Sombra dos Cards

**Arquivo:** `src/index.css`

Modificar `.neon-glow-strong` para usar roxo:

```css
.neon-glow-strong {
  box-shadow: 0 8px 24px var(--neon-glow-purple);
}
```

#### 3. Atualizar GlassCard Hover

**Arquivo:** `src/components/GlassCard.tsx`

Mudar a sombra no hover de verde para roxo:

```tsx
hover:shadow-[0_0_40px_rgba(180,50,255,0.3)]  /* Era verde, agora roxo */
```

### Resultado Visual

```text
┌────────────────────────────────────────────┐
│  Menu inferior: Verde neon ✓               │
│  Botões: Verde neon ✓                      │
│  Ícones ativos: Verde neon ✓               │
│  Sombras dos cards: Roxo neon (NOVO) ✨     │
│  Glow no hover dos cards: Roxo neon (NOVO) │
└────────────────────────────────────────────┘
```

### Arquivos a Modificar

1. `src/index.css` - Adicionar variável roxo e atualizar `.neon-glow-strong`
2. `src/components/GlassCard.tsx` - Atualizar cor do hover shadow

