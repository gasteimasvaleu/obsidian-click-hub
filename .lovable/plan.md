

## Exibir Título e Descrição Completos no Player

### Problema Identificado

O player de áudio atualmente usa a classe CSS `truncate` nos elementos de título e descrição, o que corta o texto quando é muito longo. O usuário quer ver o texto completo.

### Solução

Modificar o componente `AudioPlayer.tsx` para:

1. Remover a classe `truncate` do título e descrição
2. Reorganizar o layout para acomodar textos mais longos
3. Permitir que o texto quebre em múltiplas linhas

### Mudanças no Código

**Arquivo:** `src/components/audiofy/AudioPlayer.tsx`

**Antes (linhas 238-265):**
- Layout horizontal com título e descrição truncados
- Tempo de reprodução na mesma linha

**Depois:**
- Título e descrição em layout vertical sem truncamento
- Permitir quebra de linha natural (word-wrap)
- Tempo de reprodução movido para linha separada ou abaixo
- Ajuste de espaçamento para textos mais longos

### Resultado Esperado

Quando o usuário clicar em uma música:
- O título completo aparecerá no player
- A descrição completa aparecerá abaixo do título
- O player expandirá verticalmente para acomodar textos longos
- Layout permanece limpo e legível em mobile e desktop

