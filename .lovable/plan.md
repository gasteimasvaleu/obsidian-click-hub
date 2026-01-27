

## Sistema de Cadastro com Integração Hotmart

### Visão Geral

Criar um sistema completo de cadastro integrado com Hotmart, onde:
1. Usuário compra na Hotmart
2. Hotmart envia webhook para nosso sistema
3. Criamos um registro na tabela `subscribers` com um token único
4. Enviamos email via Resend com link contendo o token
5. Usuário acessa a página de cadastro, preenche dados e define senha
6. Sistema valida o token e cria a conta no Supabase Auth

---

### Arquitetura do Fluxo

```text
+------------------+     PURCHASE_COMPLETE     +----------------------+
|     Hotmart      | -----------------------> |  Edge Function       |
|    (Checkout)    |        Webhook           |  hotmart-webhook     |
+------------------+                          +----------------------+
                                                       |
                                                       | 1. Cria subscriber
                                                       | 2. Gera token único
                                                       v
                                              +----------------------+
                                              |   Tabela subscribers |
                                              |   (status: pending)  |
                                              +----------------------+
                                                       |
                                                       | 3. Envia email
                                                       v
                                              +----------------------+
                                              |      Resend API      |
                                              +----------------------+
                                                       |
                                                       | Email com link
                                                       v
                                              +----------------------+
                                              |      Usuário         |
                                              +----------------------+
                                                       |
                                                       | 4. Acessa /cadastro?token=xxx
                                                       v
                                              +----------------------+
                                              |   Página Cadastro    |
                                              |   (nome, senha)      |
                                              +----------------------+
                                                       |
                                                       | 5. Edge function valida
                                                       v
                                              +----------------------+
                                              |  Edge Function       |
                                              |  complete-signup     |
                                              +----------------------+
                                                       |
                                                       | 6. Cria usuário no Auth
                                                       | 7. Atualiza subscriber
                                                       v
                                              +----------------------+
                                              |   Supabase Auth      |
                                              |   + profiles table   |
                                              +----------------------+
```

---

### 1. Banco de Dados

**Nova Tabela: `subscribers`**

```sql
CREATE TYPE subscription_status AS ENUM ('pending', 'active', 'cancelled', 'expired');

CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  hotmart_transaction_id TEXT UNIQUE,
  hotmart_product_id TEXT,
  hotmart_offer_id TEXT,
  subscription_status subscription_status NOT NULL DEFAULT 'pending',
  signup_token TEXT UNIQUE,
  signup_token_expires_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Admins podem gerenciar
CREATE POLICY "Admins can manage subscribers"
  ON subscribers FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Usuários podem ver sua própria assinatura
CREATE POLICY "Users can view own subscription"
  ON subscribers FOR SELECT
  USING (user_id = auth.uid());
```

---

### 2. Edge Functions

#### 2.1 `hotmart-webhook`
Recebe eventos da Hotmart e processa compras/cancelamentos.

**Responsabilidades:**
- Validar assinatura do webhook (HOTTOK)
- Processar evento `PURCHASE_COMPLETE`: criar subscriber + enviar email
- Processar evento `PURCHASE_CANCELED`: desativar acesso

**Secrets necessários:**
- `HOTMART_HOTTOK` - Token de validação do webhook
- `RESEND_API_KEY` - Chave da API do Resend

#### 2.2 `complete-signup`
Completa o cadastro do usuário após ele definir a senha.

**Responsabilidades:**
- Validar token (existe, não expirou, status pending)
- Criar usuário no Supabase Auth
- Atualizar subscriber (user_id, status: active)

---

### 3. Páginas Frontend

#### 3.1 Modificar `/login`
- Remover tab de "Criar Conta"
- Manter apenas formulário de login
- Adicionar link "Ainda não tem conta? Assine aqui" → Hotmart

#### 3.2 Nova página `/cadastro`
- Recebe `?token=xxx` na URL
- Valida token via edge function
- Se válido: mostra formulário (nome, telefone, senha)
- Se inválido/expirado: mostra mensagem de erro com opções

**Estados da página:**
1. **Carregando**: Validando token...
2. **Token válido**: Formulário de cadastro
3. **Token inválido**: Mensagem de erro + link para suporte
4. **Token expirado**: Mensagem + botão para reenviar email
5. **Sucesso**: Conta criada, redireciona para login

---

### 4. Email Template

Email enviado via Resend contendo:
- Saudação com nome do cliente
- Informação sobre a compra
- Botão/link para completar cadastro
- Aviso de expiração do link (48h)

---

### 5. Fluxo de Cancelamento

Quando Hotmart envia `PURCHASE_CANCELED`:
1. Busca subscriber pelo `hotmart_transaction_id`
2. Atualiza `subscription_status` para `cancelled`
3. Se tiver `user_id`, desativa o usuário (opcional: usar Supabase Admin API)

---

### 6. Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/migrations/xxx_create_subscribers.sql` | Criar tabela |
| `supabase/functions/hotmart-webhook/index.ts` | Nova edge function |
| `supabase/functions/complete-signup/index.ts` | Nova edge function |
| `src/pages/Cadastro.tsx` | Nova página |
| `src/pages/Login.tsx` | Remover tab signup |
| `src/App.tsx` | Adicionar rota /cadastro |
| `supabase/config.toml` | Adicionar novas functions |

---

### 7. Secrets Necessários

Antes de implementar, será necessário adicionar:

1. **HOTMART_HOTTOK** - Token para validar webhooks da Hotmart
2. **RESEND_API_KEY** - Chave da API do Resend para enviar emails

---

### 8. Considerações de Segurança

- Token de signup expira em 48 horas
- Webhook valida HOTTOK antes de processar
- Edge functions com `verify_jwt = false` (são públicas)
- RLS na tabela subscribers impede acesso não autorizado
- Tokens são únicos e de uso único

