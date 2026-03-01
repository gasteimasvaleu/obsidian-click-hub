

## Corrigir Scroll Horizontal no Guia dos Pais

### Problema
No celular, o formulario do Guia dos Pais permite scroll horizontal, quebrando a experiencia de app nativo. Isso acontece em determinados steps do formulario e potencialmente na tela de resultado.

### Causa Raiz
- Os grids de badges nos steps 4 (Comportamento) e 5 (Personalidade) usam `grid-cols-3` que pode estourar em telas pequenas com palavras longas como "Questionador", "Colaborativo", "Independente"
- O efeito `neon-glow` (box-shadow) pode gerar overflow visual
- Os `AccordionItem` no `GuideDisplay` usam `px-6` que somado ao padding do card pai pode ultrapassar a largura
- O titulo "Roteiro de Conversa Passo a Passo" nos AccordionTriggers pode ser muito longo para telas pequenas

### Correcoes Planejadas

**Arquivo: `src/components/guia-pais/ParentsGuideForm.tsx`**
- Alterar grid de badges de `grid-cols-3 sm:grid-cols-4` para `grid-cols-2 sm:grid-cols-3` nos steps 4 e 5
- Adicionar `overflow-hidden` no wrapper principal do formulario
- Adicionar `truncate` ou `text-center break-words` nos badges para textos longos

**Arquivo: `src/components/guia-pais/GuideDisplay.tsx`**
- Reduzir padding dos `AccordionItem` de `px-6` para `px-3 sm:px-6`
- Adicionar `overflow-hidden` e `break-words` nos containers de texto gerado pela IA
- Garantir que o `CardTitle` no roteiro de conversa quebre linha em vez de estourar (`flex-wrap` ou `flex-col`)
- Adicionar `overflow-hidden` no container de tabs

**Arquivo: `src/pages/GuiaPais.tsx`**
- Garantir que o wrapper principal ja tem `overflow-x-hidden` (ja presente, verificar se esta correto)

### Nenhuma alteracao no package.json
O script de build permanece inalterado para compatibilidade com Appflow.

### Arquivos Modificados
- `src/components/guia-pais/ParentsGuideForm.tsx`
- `src/components/guia-pais/GuideDisplay.tsx`

