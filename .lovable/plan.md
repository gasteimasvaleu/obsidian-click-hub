

# Corrigir estouro de layout ao focar no Textarea (Guia Pais)

## Problema

Quando o teclado virtual abre no mobile ao tocar no Textarea (steps 7, 8, 9), a página estoura horizontalmente. Isso acontece porque o `min-h-[120px]` do Textarea combinado com o redimensionamento do viewport pelo teclado causa overflow.

## Correção

**`src/components/guia-pais/ParentsGuideForm.tsx`**:
- Nos Textareas dos steps 7, 8 e 9, adicionar `resize-none w-full max-w-full` para impedir redimensionamento manual e garantir que não ultrapasse o contêiner.

**`src/components/guia-pais/ParentsGuideForm.tsx`** — contêiner do form:
- No Card principal (linha ~138), adicionar `overflow-hidden w-full max-w-full` para conter qualquer overflow interno.

**`src/components/ui/textarea.tsx`**:
- Adicionar `resize-none` como classe padrão do componente Textarea para evitar que o usuário redimensione e cause overflow.

Essas mudanças garantem que o Textarea nunca ultrapasse a largura do contêiner, mesmo quando o teclado virtual abre no iOS/Android.

