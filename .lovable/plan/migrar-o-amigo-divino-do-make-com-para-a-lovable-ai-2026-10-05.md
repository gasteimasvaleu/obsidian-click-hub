# Migrar o Amigo Divino do Make.com para a Lovable AI

Hoje o chat do Amigo Divino envia cada mensagem para um webhook do Make.com, que processa a resposta fora do app. Vamos trazer essa inteligência para dentro do projeto usando a Lovable AI, sem depender mais do Make.

## O que muda para o usuário

Nada visualmente — o chat continua igual. A diferença é que as respostas passam a ser geradas pela IA nativa do projeto, com a persona de conselheiro espiritual católico definida por nós, sem depender de serviço externo.

## Mudanças

### 1. Nova função no servidor: `amigo-divino-chat`

Criar a edge function `supabase/functions/amigo-divino-chat/index.ts` que:

- Recebe a mensagem do usuário e o histórico da conversa
- Chama a Lovable AI Gateway (modelo `openai/gpt-6-astra`, endpoint `/v1/responses`, com streaming) usando a `LOVABLE_API_KEY` já configurada no projeto
- Usa um prompt de sistema com a persona do Amigo Divino: conselheiro espiritual católico, alinhado à doutrina, acolhedor, focado em famílias e crianças, citando a Bíblia quando apropriado
- Retorna a resposta em texto para o app
- Trata erros em português (limite de uso, indisponibilidade) com mensagens amigáveis

### 2. Atualizar `src/components/ChatInterface.tsx`

- Trocar a chamada ao webhook do Make (`hook.us2.make.com/...`) pela chamada à nova função `amigo-divino-chat` via `supabase.functions.invoke`
- Enviar junto o histórico de mensagens da conversa (hoje o Make recebe só a mensagem isolada; com a Lovable AI o Amigo Divino passa a lembrar do contexto da conversa — melhoria incluída)
- Manter todo o resto: consentimento de IA, sugestões rápidas, loading, markdown

### 3. Teste

- Testar a função com uma mensagem real e validar a resposta antes de concluir

## Observações

- O webhook do Make deixa de ser chamado; o cenário no Make.com pode ser desativado depois, sem pressa
- O uso da Lovable AI consome créditos do workspace por mensagem enviada
- O consentimento de IA (exigido pela Apple) já existe no chat e continua funcionando

## Risco

Baixo — uma função nova e uma troca de endpoint no chat. Se algo falhar, basta reverter a chamada.
