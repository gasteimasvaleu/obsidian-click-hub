

# Melhorias de UX — Chat do Amigo Divino

## O que será feito

### 1. Sugestões rápidas contextuais
Chips clicáveis no estado vazio, alinhados ao propósito do Amigo Divino (conselheiro espiritual, mediador familiar):
- "Como lidar com birras à luz da Bíblia?"
- "Meu filho está com medo, o que fazer?"
- "Uma oração em família"
- "Como ensinar perdão aos filhos?"

### 2. Animação de digitação (bouncing dots)
Substituir "Digitando..." por 3 bolinhas animadas estilo WhatsApp. CSS puro com `@keyframes bounce` e delay escalonado.

### 3. Renderização de markdown
Instalar `react-markdown` e usar no conteúdo das respostas. **Não precisa alterar nada no Make** — o markdown é apenas renderização no frontend. Se a IA no Make já retorna texto com `*negrito*` ou listas, vai funcionar automaticamente. Se retorna texto puro, continua funcionando igual.

### 4. Redesign visual do chat
- **Remover GlassCard** que envolve as mensagens — deixar mensagens flutuarem direto no fundo, estilo app de mensagens nativo
- **Bolhas do usuário**: fundo com gradiente sutil usando a cor primary, cantos mais arredondados
- **Bolhas do assistente**: fundo glass sutil com borda suave
- **Área de input redesenhada**: trocar `Input` por `Textarea` com auto-resize (1→4 linhas), bordas arredondadas maiores, botão de enviar circular integrado ao campo, visual mais polido e moderno
- Reduzir `pb-36` para `pb-24`

## Alterações técnicas

| Arquivo | O que muda |
|---|---|
| `src/components/ChatInterface.tsx` | Sugestões, dots, markdown, redesign bolhas, textarea auto-resize, remover GlassCard |
| `src/index.css` | Adicionar keyframes para bouncing dots |
| `package.json` | Adicionar `react-markdown` |

**Make/backend**: nenhuma alteração necessária.

