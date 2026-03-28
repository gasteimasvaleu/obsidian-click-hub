

## Adicionar envio de Token VIP via WhatsApp (Z-API)

### Resumo
Adicionar opção no formulário de Tokens VIP para enviar o convite via WhatsApp usando a Z-API, além do email existente. O admin escolhe o canal de envio (Email, WhatsApp ou ambos).

### Mudancas

**1. `src/pages/admin/VipTokenManager.tsx`**
- Adicionar campo de telefone (com placeholder formato BR: `(11) 99999-9999`)
- Adicionar seletor de canal: "Email", "WhatsApp" ou "Ambos"
- Email obrigatório quando canal inclui Email; telefone obrigatório quando inclui WhatsApp
- Passar `phone` e `sendVia` no body da request

**2. `supabase/functions/send-vip-token/index.ts`**
- Receber `phone` e `sendVia` (`email`, `whatsapp`, `both`) no body
- Após criar/atualizar subscriber e gerar token:
  - Se `sendVia` inclui `whatsapp`: enviar mensagem via Z-API com texto formatado e amigável, incluindo link de cadastro
  - Se `sendVia` inclui `email`: enviar email via Resend (logica existente)
- Mensagem WhatsApp sera algo como:

```
🎉 *Parabéns, {nome}!*

Você recebeu um *Acesso VIP* ao *BíbliaTooon Kids*! 🌟

O BíbliaTooon Kids é um app cristão feito com carinho para crianças aprenderem sobre a Bíblia de forma divertida e interativa! 📖✨

Aqui você encontra:
📚 Histórias bíblicas animadas
🎮 Jogos educativos
🎨 Desenhos para colorir
🙏 Orações e devocionais diários

👉 Complete seu cadastro agora e ative seu acesso VIP:
{signupUrl}

⚠️ Este link expira em *48 horas*.

Com carinho,
Equipe BíbliaTooon Kids 💜
```

- Usa os secrets Z-API existentes: `ZAPI_INSTANCE`, `ZAPI_TOKEN`, `ZAPI_CLIENT_TOKEN`

### Arquivos afetados

| Arquivo | Mudanca |
|---------|---------|
| `src/pages/admin/VipTokenManager.tsx` | Adicionar campo telefone + seletor de canal |
| `supabase/functions/send-vip-token/index.ts` | Adicionar logica de envio WhatsApp via Z-API |

### Secrets
Os secrets `ZAPI_INSTANCE`, `ZAPI_TOKEN` e `ZAPI_CLIENT_TOKEN` ja existem no projeto (usados pelo `send-whatsapp`).

