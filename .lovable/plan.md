

## Corrigir header verde e composer branco no celular

### Problemas visíveis na screenshot
1. **Header verde**: tem um espaço vazio enorme acima do título — o `safe-area-inset-top` no dispositivo real é grande, e ainda tem `pt-3` no wrapper externo somando
2. **Composer branco**: tem espaço excessivo abaixo do input — `safe-area-inset-bottom` + `pb-3` do wrapper externo + `0.75rem` extra

### Causa raiz
O wrapper intermediário (linha 200) tem `px-3 pb-3 pt-3` e `rounded-2xl` no card interno. Isso cria margens desnecessárias ao redor do card, desperdiçando espaço em todos os lados.

### Correções em `src/components/ChatInterface.tsx`

1. **Remover wrapper intermediário** — eliminar o `div` da linha 200 com `px-3 pb-3 pt-3`, fazendo o card interno preencher toda a tela
2. **Card interno full-screen** — remover `rounded-2xl`, `mx-auto`, `max-w-3xl` e usar `flex h-full flex-col`
3. **Header** — remover `rounded-t-2xl` (não precisa mais), manter apenas `safe-area-inset-top` sem padding extra
4. **Composer** — remover `rounded-b-2xl`, reduzir padding bottom para apenas `safe-area-inset-bottom` sem o `0.75rem` adicional excessivo
5. **Textarea text color** — corrigir para `text-gray-900` já que o fundo do composer é branco

