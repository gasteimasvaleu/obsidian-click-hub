

## Plano: Corrigir layout do Chat do Amigo Divino

### Problemas identificados:
1. O GlassCard do chat fica cortado atrás da barra "Amigo Divino" (sub-header sticky)
2. Muito espaço lateral reduzindo a area util do chat
3. Input parcialmente escondido pelo tubelight menu

### Mudancas no `src/components/ChatInterface.tsx`:

1. **Adicionar `pt-28`** ao container principal do chat para compensar a navbar (top-0) + sub-header (top-14) ambos fixos/sticky
2. **Reduzir padding lateral** - trocar `p-4` por `px-2` no ScrollArea e remover `container mx-auto` desnecessario para usar a largura toda
3. **Reduzir padding do GlassCard** - de `p-4` para `p-3` para ganhar mais espaco interno
4. **Ajustar max-width** - remover ou aumentar `max-w-2xl` para aproveitar mais a tela
5. **Manter `pb-36`** no input area (ja esta correto para o tubelight)

