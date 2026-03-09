

## Correção do estouro de layout no passo 7 (Textarea) do Guia para Pais

**Problema**: Ao clicar no textarea do passo 7, o teclado virtual abre e a página estoura horizontalmente (imagem 2). O passo 1 (Input) não tem esse problema.

**Causa raiz**: O passo 1 usa `<Input>` (campo de linha única que não redimensiona), enquanto os passos 7, 8 e 9 usam `<Textarea>`. Quando o teclado virtual abre no mobile, o textarea pode causar reflow que empurra o layout para fora da tela. Apesar de já ter `resize-none` e `overflow-hidden` no Card, o GlassCard do header e o container do formulário não estão contidos adequadamente.

**Solução**: Aplicar as mesmas restrições de overflow do passo 1 nos containers externos:

1. **`ParentsGuideForm.tsx`** - container raiz do formulário:
   - Adicionar `overflow-hidden` ao div raiz (já tem `overflow-x-hidden`, trocar para `overflow-hidden`)
   - Adicionar `box-sizing: border-box` implícito via `w-full max-w-full` no GlassCard do header

2. **`ParentsGuideForm.tsx`** - steps 7, 8, 9 (textareas):
   - Envolver cada textarea em um `div` com `overflow-hidden w-full`
   - Adicionar `box-border` nos textareas para garantir que padding não extrapole

3. **`GuiaPais.tsx`** - container da página:
   - Adicionar `overflow-hidden` ao div `pt-16 px-4` para conter qualquer reflow filho

Estas mudanças replicam o padrão de contenção que já funciona no passo 1, garantindo que o teclado virtual não cause estouro horizontal.

