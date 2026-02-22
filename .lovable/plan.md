

# Corrigir clip das imagens com border-radius no clipPath

## Problema
Com a abordagem atual (imagem fora do GlassCard), o `overflow-hidden` do GlassCard nao afeta a imagem porque ela esta no wrapper externo. A imagem transborda livremente em todas as direcoes.

## Solucao
Voltar as imagens para DENTRO do GlassCard e usar `clipPath: inset()` com a sintaxe de border-radius. O `inset()` suporta `round` para aplicar border-radius no recorte:

```
clipPath: 'inset(-50px -10px 0 -10px round 0 0 1rem 1rem)'
```

Isso significa:
- Top: -50px (permite vazamento no topo)
- Right: -10px (margem lateral)
- Bottom: 0 (corta rente a borda inferior)
- Left: -10px (margem lateral)
- `round 0 0 1rem 1rem`: aplica border-radius apenas nos cantos inferiores

## Alteracoes em `src/pages/Index.tsx`:

### Card principal (linhas 63-77):
- Remover o wrapper `<div className="relative">`
- Mover a `<img>` de volta para dentro do GlassCard
- Adicionar `style={{ clipPath: 'inset(-50px -10px 0 -10px round 0 0 1rem 1rem)' }}` no GlassCard
- Remover `overflow-hidden` do GlassCard (clipPath faz o trabalho)

### Cards do grid (linhas 84-108):
- Remover o wrapper `<div className="relative">`
- Mover imagem/placeholder de volta para dentro do GlassCard
- Adicionar `style={{ clipPath: 'inset(-40px -10px 0 -10px round 0 0 1rem 1rem)' }}` no GlassCard
- Remover `overflow-hidden`

### Estrutura final do card principal:
```tsx
<GlassCard
  hoverable
  pressable
  onClick={mainAction.action}
  className="relative h-[100px] pl-[80px] pr-4 flex items-center cursor-pointer"
  style={{ clipPath: 'inset(-50px -10px 0 -10px round 0 0 1rem 1rem)' }}
>
  <img
    src="..."
    alt="Acessar Cursos"
    className="absolute left-2 bottom-0 h-[130px] w-auto object-contain pointer-events-none"
  />
  <span>Acessar Cursos</span>
</GlassCard>
```

O `round 0 0 1rem 1rem` garante que o recorte inferior acompanha o border-radius do card (que usa `--radius: 1rem` / `rounded-2xl`).

