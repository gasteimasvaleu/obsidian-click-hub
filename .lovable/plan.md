

# Corrigir corte inferior das imagens nos cards

## Problema
O `clipPath: inset(-50px -10px 0 -10px)` nao esta cortando a parte inferior das imagens como esperado. As imagens estao transbordando alem da borda inferior do card, como visivel na captura de tela.

## Solucao

Trocar a abordagem de `clipPath` por uma combinacao de `overflow-hidden` no GlassCard (para cortar a imagem na parte inferior com o border-radius) e um wrapper externo com `overflow-visible` para permitir o vazamento no topo.

### Alteracoes em `src/pages/Index.tsx`:

**Card principal (~linhas 63-76):**
- Remover `style={{ clipPath: ... }}`
- Envolver o GlassCard num `div` com `overflow-visible` e posicao relativa
- Mover a imagem para fora do GlassCard, posicionada absolutamente no wrapper (assim vaza no topo)
- Adicionar `overflow-hidden` ao GlassCard para cortar a parte inferior com border-radius

Alternativa mais simples: manter a estrutura atual mas usar `overflow-hidden` no card e posicionar a imagem com `bottom-0` dentro dele. A parte inferior sera cortada pelo border-radius. Para o topo vazar, usar um wrapper com margin negativo no topo.

**Abordagem final escolhida (mais limpa):**
1. Remover `clipPath` de ambos os cards
2. Adicionar `overflow-hidden` na className dos GlassCards
3. A imagem com `bottom-0` e `h-[130px]` num card de `h-[100px]` vai naturalmente ficar cortada no topo pelo overflow-hidden
4. Para o topo vazar: mover a tag `<img>` para ANTES do GlassCard, posicionada absolutamente num wrapper div

### Estrutura do card principal:
```
<div className="relative"> {/* wrapper */}
  <img ... className="absolute left-2 bottom-0 h-[130px] z-10" />
  <GlassCard className="relative h-[100px] overflow-hidden pl-[80px] ...">
    <span>Acessar Cursos</span>
  </GlassCard>
</div>
```

A imagem fica posicionada absolutamente no wrapper (que nao tem overflow-hidden), alinhada com `bottom-0` do wrapper. O GlassCard fica com overflow-hidden para manter seu visual limpo. A imagem vaza livremente no topo.

### Mesma logica para cards do grid.

### Detalhes tecnicos:
- Arquivo: `src/pages/Index.tsx`
- Remover prop `style` dos GlassCards (nao precisa mais de clipPath)
- Criar wrapper `<div className="relative">` ao redor de cada card
- Mover `<img>` e o placeholder div de icone para dentro do wrapper mas FORA do GlassCard
- Ajustar z-index para imagem ficar sobre o card
- Manter `pointer-events-none` na imagem para nao bloquear clicks no card

