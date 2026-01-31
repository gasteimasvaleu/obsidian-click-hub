

## Adicionar Mensagem Motivacional ao WhatsApp

### Objetivo

Incluir uma mensagem motivacional inspiradora após o devocional diário enviado via WhatsApp, tornando o conteúdo mais completo e edificante.

### Estrutura da Mensagem Atualizada

A mensagem ficará organizada assim:

1. **Cabeçalho** - Devocional Diário + Data
2. **Tema do dia**
3. **Versículo** - Referência + Texto
4. **Reflexão**
5. **Oração**
6. **Mensagem Motivacional** (NOVA)
7. **Link do app**

### Mensagem Motivacional a ser Adicionada

```
🌟 *MENSAGEM DE HOJE* 🌟

Bom dia, amigo(a)! Hoje quero te lembrar de algo poderoso:

1. 🙏 Confie em Deus como sua fonte de esperança.
2. 😊 Permita que Ele encha seu coração de alegria.
3. 🕊️ Receba Sua paz que acalma qualquer tempestade.
4. 💪 Deixe o Espírito Santo renovar suas forças a cada instante.

Quando você deposita sua confiança em Deus, algo maravilhoso acontece:

➡️ Sua alegria cresce mesmo em dias difíceis.
➡️ Sua paz interior afasta a ansiedade e o medo.
➡️ Você começa a transbordar esperança e pode inspirar quem está ao seu lado!

Hoje, reserve um momento para fechar os olhos, respirar fundo e dizer:

_"Senhor, eu confio em Ti. Enche-me de alegria, paz e esperança!"_

Que essa oração simples traga luz ao seu dia e faça seu coração vibrar de fé. Lembre-se: você nunca está sozinho(a). O Deus da esperança caminha com você, fortalecendo seus passos e enchendo sua vida de motivos para sorrir!

Tenha um dia abençoado! 🙌✨

━━━━━━━━━━━━━━━━━━━━

💌 Compartilhe com alguém que precisa de um sopro de esperança hoje!
```

### Alteração Técnica

**Arquivo:** `supabase/functions/send-daily-devotional-whatsapp/index.ts`

Modificar a função `formatDevotionalMessage` para incluir a mensagem motivacional entre a oração e o link do app.

### Considerações

- A mensagem motivacional é fixa/estática (sempre a mesma)
- Será adicionada como uma nova seção após a oração
- Mantém a formatação consistente com o resto da mensagem (emojis, separadores, negrito)
- Futuramente, poderia ser expandido para ter várias mensagens motivacionais rotativas

