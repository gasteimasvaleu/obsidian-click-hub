

## Devocional Diário via WhatsApp - Plano de Implementação

### Visao Geral

Implementar o envio automático do devocional diário para assinantes via WhatsApp usando a Z-API. O sistema enviará mensagens todas as manhãs às 6h para usuários que optaram por receber.

### Arquitetura da Solucao

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE ENVIO DIÁRIO                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐     ┌────────────────────┐     ┌───────────────────┐     │
│  │  pg_cron     │────>│ send-daily-        │────>│ Z-API             │     │
│  │  (6h diário) │     │ devotional-whatsapp│     │ /send-text        │     │
│  └──────────────┘     └────────────────────┘     └───────────────────┘     │
│                              │                           │                  │
│                              ▼                           ▼                  │
│                       ┌─────────────────┐        ┌──────────────────┐      │
│                       │ daily_devotionals│        │  WhatsApp Users  │      │
│                       │ (devocional hoje)│        │  (assinantes)    │      │
│                       └─────────────────┘        └──────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE OPT-IN/OPT-OUT                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐     ┌────────────────────┐     ┌───────────────────┐     │
│  │  Pagina de   │────>│ subscribers        │     │ Toggle switch     │     │
│  │  Perfil      │     │ whatsapp_optin     │<────│ "Receber no Zap"  │     │
│  └──────────────┘     └────────────────────┘     └───────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Detalhes Tecnicos

#### 1. Secrets Necessarios

Adicionar 3 novos secrets no Supabase:

| Secret | Descricao |
|--------|-----------|
| `ZAPI_INSTANCE` | ID da instância da Z-API (ex: `123456`) |
| `ZAPI_TOKEN` | Token da instância Z-API |
| `ZAPI_CLIENT_TOKEN` | Token de segurança da conta Z-API |

#### 2. Migracao do Banco de Dados

**Adicionar coluna `whatsapp_optin` na tabela `subscribers`:**

```sql
ALTER TABLE subscribers 
ADD COLUMN whatsapp_optin BOOLEAN DEFAULT false,
ADD COLUMN whatsapp_optin_at TIMESTAMP WITH TIME ZONE;
```

Essa coluna indica se o usuário deseja receber mensagens no WhatsApp.

#### 3. Edge Function: `send-whatsapp`

**Novo arquivo:** `supabase/functions/send-whatsapp/index.ts`

Funcao utilitaria para enviar mensagens via Z-API:

```typescript
// Estrutura basica:
// - Recebe: phone, message
// - Envia para: https://api.z-api.io/instances/{INSTANCE}/token/{TOKEN}/send-text
// - Headers: Client-Token, Content-Type: application/json
// - Body: { phone, message }
```

#### 4. Edge Function: `send-daily-devotional-whatsapp`

**Novo arquivo:** `supabase/functions/send-daily-devotional-whatsapp/index.ts`

Funcao principal que sera chamada pelo cron:

```typescript
// Fluxo:
// 1. Buscar devocional do dia na tabela daily_devotionals
// 2. Buscar assinantes ativos com whatsapp_optin = true
// 3. Para cada assinante:
//    - Formatar mensagem do devocional
//    - Enviar via send-whatsapp
//    - Log de sucesso/erro
// 4. Retornar estatisticas de envio
```

**Formato da Mensagem:**

```text
📿 *DEVOCIONAL DIÁRIO*
📅 30 de Janeiro de 2026

✨ *{tema}*

━━━━━━━━━━━━━━━━━━━━
📖 *VERSÍCULO DO DIA*
{livro} {capitulo}:{versiculo}

_{texto_versiculo}_

━━━━━━━━━━━━━━━━━━━━
💭 *REFLEXÃO*

{reflexao_resumida}

━━━━━━━━━━━━━━━━━━━━
🙏 *ORAÇÃO*

{oracao}

━━━━━━━━━━━━━━━━━━━━

👉 Leia o devocional completo no app:
https://app.bibliatoonkids.com/devocional
```

#### 5. Configuracao do CRON Job

**Arquivo SQL para configurar o cron:**

```sql
-- Executar todo dia as 6h (horario de Brasilia = 9h UTC)
SELECT cron.schedule(
  'send-devotional-whatsapp',
  '0 9 * * *',  -- 9h UTC = 6h BRT
  $$
  SELECT net.http_post(
    url:='https://fnksvazibtekphseknob.supabase.co/functions/v1/send-daily-devotional-whatsapp',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer {ANON_KEY}"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);
```

#### 6. Interface de Opt-in no Perfil

**Novo componente:** `src/components/profile/WhatsAppOptinSection.tsx`

Card na pagina de Perfil com:
- Switch para ativar/desativar recebimento
- Campo para confirmar/editar numero de telefone
- Texto explicativo sobre o horario de envio

**Visual:**

```text
┌────────────────────────────────────────────────────────────────┐
│  📱 Devocional no WhatsApp                                     │
│  ──────────────────────────────────────────────────────────────│
│                                                                │
│  Receba o devocional diário no seu WhatsApp às 6h da manhã    │
│                                                                │
│  Número: +55 (11) 99999-9999  [Editar]                        │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  ○ Desativado          ●━━━━━━━━● Ativado              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ⚠️ Certifique-se de que o numero esta no WhatsApp             │
└────────────────────────────────────────────────────────────────┘
```

#### 7. Atualizacoes na Pagina de Perfil

**Arquivo:** `src/pages/Profile.tsx`

- Importar e adicionar o novo componente `WhatsAppOptinSection`
- Posicionar abaixo da secao de Aparencia

### Arquivos a Criar

1. **Secret Z-API** - `ZAPI_INSTANCE`, `ZAPI_TOKEN`, `ZAPI_CLIENT_TOKEN`
2. **Migracao** - Adicionar coluna `whatsapp_optin` na tabela `subscribers`
3. **`supabase/functions/send-whatsapp/index.ts`** - Funcao utilitaria para enviar mensagens
4. **`supabase/functions/send-daily-devotional-whatsapp/index.ts`** - Funcao principal do cron
5. **`supabase/config.toml`** - Adicionar configuracoes das novas funcoes
6. **`docs/cron-whatsapp-setup.sql`** - Documentacao para configurar o cron
7. **`src/components/profile/WhatsAppOptinSection.tsx`** - Componente de opt-in
8. **`src/pages/Profile.tsx`** - Adicionar secao de WhatsApp

### Fluxo Completo

1. **Usuario ativa opt-in**
   - Acessa Perfil > Devocional no WhatsApp
   - Confirma numero de telefone
   - Ativa o switch
   - Sistema salva `whatsapp_optin = true` em `subscribers`

2. **Cron diario (6h)**
   - pg_cron dispara a funcao `send-daily-devotional-whatsapp`
   - Funcao busca devocional do dia
   - Funcao busca assinantes com opt-in ativo
   - Para cada assinante, envia mensagem formatada via Z-API

3. **Usuario desativa opt-in**
   - Desativa o switch no Perfil
   - Sistema salva `whatsapp_optin = false`
   - Proximo cron nao envia mais para esse usuario

### Consideracoes Importantes

- **Rate Limit Z-API:** A Z-API tem limites de envio. Recomenda-se adicionar um delay de 1-2 segundos entre cada mensagem para evitar bloqueios
- **Formato do Telefone:** Deve ser salvo sem formatacao, apenas numeros (ex: `5511999999999`)
- **Horario:** O cron usa UTC, entao 6h de Brasilia = 9h UTC
- **Fallback:** Se o devocional do dia nao existir, o cron nao faz nada (evita erros)
- **Logs:** Importante adicionar logs detalhados para debug

