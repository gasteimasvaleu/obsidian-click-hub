# Efeito shine (brilho deslizante) nos cards da tela inicial

## Objetivo
Um brilho de luz atravessa cada card da tela inicial, um de cada vez, em loop suave. O efeito é desligado automaticamente quando o usuário ativa "reduzir movimento" no celular.

## Mudanças

### 1. `tailwind.config.ts` — animação `shine`
- Adicionar keyframes `shine`:
  - `0%`: `transform: translateX(-120%) skewX(-12deg)`
  - `60%, 100%`: `transform: translateX(220%) skewX(-12deg)`
- Adicionar animation `shine`: `shine 3.6s ease-in-out infinite` (duração 3.6s conforme especificado; o brilho fica parado fora da tela entre uma passada e outra porque o movimento termina em 60% do ciclo).

### 2. `src/pages/Index.tsx` — span de brilho em cada card
- Nos botões de `featureActions` (os 9 cards empilhados):
  - Adicionar `overflow-hidden` ao botão (já tem `relative`).
  - Inserir dentro do botão, antes do conteúdo:
    ```tsx
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 animate-shine motion-reduce:animate-none"
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
        animationDelay: `${1.2 + index * 0.5}s`,
      }}
    />
    ```
  - Atraso escalonado: 1.2s no primeiro card, +0.5s por card (1.2s, 1.7s, 2.2s, ...), para o brilho passar um de cada vez.
  - `motion-reduce:animate-none` desliga o efeito quando o sistema do usuário pede redução de movimento.

## Notas técnicas
- O atraso vai via `style` inline porque é calculado por índice (Tailwind não gera classes dinâmicas).
- `overflow-hidden` no botão não afeta o visual atual: os cards já são retangulares com topo arredondado e o conteúdo não transborda.
- O efeito é só nos 9 cards de atalho da home; os cards com borda animada (border-beam) não mudam.

## Validação
- Build OK.
- Prévia: brilho passa sequencialmente pelos cards; com "reduzir movimento" ativo, nenhum brilho aparece.
