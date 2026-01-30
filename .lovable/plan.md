

## Melhorar Layout da Seção de Aparência no Mobile

### Problema Atual

No mobile, os elementos estão lado a lado (`flex items-center justify-between`) o que deixa o conteúdo apertado. O switch com os labels fica muito comprimido.

### Solução Proposta

Reorganizar o layout para:
1. **Texto em cima** - Título e descrição ocupando toda a largura
2. **Botões embaixo** - Dois botões lado a lado ocupando a mesma largura
3. **Trocar Switch por Botões** - Mais fácil de clicar no mobile

### Layout Visual

```text
Mobile:
┌─────────────────────────────────────┐
│  🎨 Aparência                       │
│  ───────────────────────────────────│
│  Cor das sombras dos cards          │
│  Escolha entre verde limão ou roxo  │
│                                     │
│  ┌───────────────┐ ┌───────────────┐│
│  │   🟢 Verde    │ │   🟣 Roxo    ││
│  └───────────────┘ └───────────────┘│
└─────────────────────────────────────┘

Desktop (mantém similar mas com mais espaço):
┌─────────────────────────────────────────────────┐
│  🎨 Aparência                                   │
│  ─────────────────────────────────────────────  │
│  Cor das sombras dos cards                      │
│  Escolha entre verde limão ou roxo neon         │
│                                                 │
│  ┌─────────────────┐  ┌─────────────────┐       │
│  │    🟢 Verde     │  │    🟣 Roxo      │       │
│  └─────────────────┘  └─────────────────┘       │
└─────────────────────────────────────────────────┘
```

### Mudanças Técnicas

**Arquivo:** `src/components/profile/AppearanceSection.tsx`

1. **Remover Switch** - Substituir por dois botões
2. **Layout Vertical** - Trocar `flex items-center justify-between` por `flex flex-col`
3. **Grid para Botões** - Usar `grid grid-cols-2 gap-3` para os botões
4. **Estilo dos Botões**:
   - Botão ativo: fundo colorido com borda destacada
   - Botão inativo: fundo sutil com borda normal
   - Cores: Verde usa `border-primary` e `bg-primary/20`, Roxo usa `border-purple-500` e `bg-purple-500/20`

### Código Resultante

```tsx
<CardContent>
  <div className="flex flex-col gap-4">
    <div className="flex flex-col">
      <span className="font-medium text-foreground">Cor das sombras dos cards</span>
      <span className="text-sm text-muted-foreground">
        Escolha entre verde limão ou roxo neon
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        onClick={() => setGlowColor('green')}
        className={/* estilos condicionais para verde */}
      >
        🟢 Verde
      </Button>
      <Button
        variant="outline"
        onClick={() => setGlowColor('purple')}
        className={/* estilos condicionais para roxo */}
      >
        🟣 Roxo
      </Button>
    </div>
  </div>
</CardContent>
```

### Arquivos a Modificar

1. `src/components/profile/AppearanceSection.tsx` - Refatorar layout e trocar switch por botões

