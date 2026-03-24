

## Header verde-limão + Composer branco no chat Amigo Divino

Ideia excelente — o header em verde-limão dá identidade visual forte e o composer branco cria contraste limpo, remetendo a apps de mensagem profissionais.

### Alterações em `src/components/ChatInterface.tsx`

**1. Header (linhas 139-158)** — fundo verde-limão com textos escuros:
- Div do sub-header: adicionar `bg-primary rounded-t-2xl mx-3 mt-1`
- Botão de voltar: trocar `text-primary` por `text-primary-foreground`
- Avatar: borda e fundo escuros (`bg-black/20 text-primary-foreground`)
- Título "Amigo Divino": trocar `text-primary` por `text-primary-foreground font-bold`
- Remover o `pt-16 px-4` e ajustar para integrar visualmente com o card

**2. Composer (linhas 243-268)** — fundo branco com elementos escuros:
- Div externa: `bg-white rounded-b-2xl px-3 py-3`
- Campo interno do textarea: `bg-gray-100 border-gray-200 focus-within:border-primary`
- Texto do textarea: `text-gray-900 placeholder:text-gray-400`
- Botão de envio: manter `bg-primary text-primary-foreground` (verde sobre branco fica ótimo)

**3. Integrar header e card visualmente**
- O header verde fica como "topo" do card (rounded-t)
- As mensagens ficam no meio (sem border-radius)
- O composer branco fecha embaixo (rounded-b)
- Remover border-radius do card intermediário para que header + messages + composer formem um bloco único coeso

