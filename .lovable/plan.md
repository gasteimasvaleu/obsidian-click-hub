

## Adicionar Switch para Escolher Cor das Sombras dos Cards

### Visão Geral

Adicionar um botão switch na página de Perfil que permite ao usuário escolher entre sombras **Roxo Neon** (atual) ou **Verde Limão** (original). A preferência será salva no `localStorage` para persistir entre sessões.

### Arquitetura da Solução

```text
┌─────────────────────────────────────────────────────────────┐
│  1. Criar Context para gerenciar preferência de tema        │
│     ThemePreferencesContext                                 │
├─────────────────────────────────────────────────────────────┤
│  2. Adicionar classes CSS condicionais                      │
│     .neon-glow-strong-green / .neon-glow-strong-purple      │
├─────────────────────────────────────────────────────────────┤
│  3. Atualizar GlassCard para usar contexto                  │
│     Aplicar classe baseada na preferência                   │
├─────────────────────────────────────────────────────────────┤
│  4. Adicionar Switch na página de Perfil                    │
│     Seção "Aparência" com toggle                            │
└─────────────────────────────────────────────────────────────┘
```

### Mudanças Técnicas

#### 1. Criar Context de Preferências de Tema

**Novo arquivo:** `src/contexts/ThemePreferencesContext.tsx`

Criar um contexto React que:
- Gerencia a preferência de cor do glow (`purple` ou `green`)
- Salva/carrega do `localStorage` com chave `neon-glow-color`
- Expõe função `setGlowColor` para atualizar

#### 2. Atualizar CSS Global

**Arquivo:** `src/index.css`

Adicionar classes separadas para cada cor de glow:

```css
.neon-glow-strong-purple {
  box-shadow: 0 8px 24px var(--neon-glow-purple);
}

.neon-glow-strong-green {
  box-shadow: 0 8px 24px var(--neon-glow);
}
```

#### 3. Atualizar GlassCard

**Arquivo:** `src/components/GlassCard.tsx`

- Importar e usar o contexto de preferências
- Aplicar classe dinâmica baseada na preferência (`neon-glow-strong-purple` ou `neon-glow-strong-green`)
- Atualizar hover shadow dinamicamente

#### 4. Adicionar Switch na Página de Perfil

**Arquivo:** `src/pages/Profile.tsx`

Adicionar uma nova seção "Aparência" com:
- Label explicativo: "Cor das sombras dos cards"
- Switch com labels "Verde" / "Roxo"
- Ícone de paleta de cores

#### 5. Envolver App com Provider

**Arquivo:** `src/App.tsx`

Adicionar o `ThemePreferencesProvider` envolvendo a aplicação.

### Resultado Visual

Na página de Perfil, o usuário verá:

```text
┌────────────────────────────────────────────┐
│  ⚙️ Aparência                              │
│  ─────────────────────────────────────────  │
│  Cor das sombras     🟢 Verde  ━━○  Roxo 🟣 │
└────────────────────────────────────────────┘
```

### Arquivos a Criar/Modificar

1. **CRIAR:** `src/contexts/ThemePreferencesContext.tsx` - Contexto de preferências
2. **MODIFICAR:** `src/index.css` - Classes CSS separadas
3. **MODIFICAR:** `src/components/GlassCard.tsx` - Usar contexto para classe dinâmica
4. **MODIFICAR:** `src/pages/Profile.tsx` - Adicionar seção com Switch
5. **MODIFICAR:** `src/App.tsx` - Adicionar Provider

