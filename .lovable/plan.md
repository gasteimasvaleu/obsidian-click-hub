

## Implementação: Devocional Diário via WhatsApp

Os secrets da Z-API já estão configurados. Agora vou implementar todos os componentes do sistema.

### 1. Migração do Banco de Dados

Adicionar colunas na tabela `subscribers`:

```sql
ALTER TABLE subscribers 
ADD COLUMN IF NOT EXISTS whatsapp_optin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS whatsapp_optin_at TIMESTAMP WITH TIME ZONE;
```

### 2. Edge Functions

**2.1. `supabase/functions/send-whatsapp/index.ts`**

Função utilitária para enviar mensagens via Z-API:
- Recebe `phone` e `message`
- Formata o número (adiciona 55 se necessário)
- Envia para a API da Z-API
- Retorna sucesso/erro

**2.2. `supabase/functions/send-daily-devotional-whatsapp/index.ts`**

Função principal chamada pelo cron:
- Busca o devocional do dia
- Busca assinantes com `whatsapp_optin = true` e `subscription_status = 'active'`
- Formata a mensagem com tema, versículo, reflexão e oração
- Envia para cada assinante com delay de 1.5s (rate limiting)
- Retorna estatísticas de envio

**2.3. Atualizar `supabase/config.toml`**

```toml
[functions.send-whatsapp]
verify_jwt = true

[functions.send-daily-devotional-whatsapp]
verify_jwt = false
```

### 3. Documentação do CRON

**`docs/cron-whatsapp-setup.sql`**

Instruções para configurar o cron job no Supabase:
- Executar às 6h de Brasília (9h UTC)
- Comandos para monitorar e gerenciar o job

### 4. Componente de Opt-in

**`src/components/profile/WhatsAppOptinSection.tsx`**

Card na página de perfil com:
- Switch para ativar/desativar
- Campo para editar número de telefone
- Validação de número brasileiro
- Feedback visual do status

### 5. Atualização da Página de Perfil

**`src/pages/Profile.tsx`**

- Importar `WhatsAppOptinSection`
- Adicionar abaixo de `AppearanceSection`

### Formato da Mensagem WhatsApp

```
📿 *DEVOCIONAL DIÁRIO*
📅 30 de Janeiro de 2026

✨ *{tema}*

━━━━━━━━━━━━━━━━━━━━
📖 *VERSÍCULO DO DIA*
{livro} {capitulo}:{versiculo}

_{texto_versiculo}_

━━━━━━━━━━━━━━━━━━━━
💭 *REFLEXÃO*

{reflexao}

━━━━━━━━━━━━━━━━━━━━
🙏 *ORAÇÃO*

{oracao}

━━━━━━━━━━━━━━━━━━━━

👉 Leia o devocional completo no app:
https://obsidian-click-hub.lovable.app/devocional
```

### Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `subscribers` (banco) | Adicionar colunas whatsapp_optin |
| `supabase/functions/send-whatsapp/index.ts` | Criar |
| `supabase/functions/send-daily-devotional-whatsapp/index.ts` | Criar |
| `supabase/config.toml` | Atualizar |
| `docs/cron-whatsapp-setup.sql` | Criar |
| `src/components/profile/WhatsAppOptinSection.tsx` | Criar |
| `src/pages/Profile.tsx` | Atualizar |

