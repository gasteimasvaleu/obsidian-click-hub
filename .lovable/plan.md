## Criar usuário VIP: Bernardo

Vou criar o usuário diretamente no banco como assinante VIP ativo.

**Dados:**
- Nome: Bernardo
- Email: bernardorodrigues.13j@gmail.com
- Senha: 685213
- Status: assinante VIP ativo

**Passos:**

1. Criar o usuário no `auth.users` via Supabase Admin API (email já confirmado, senha definida).
2. O trigger `handle_new_user` cria automaticamente o registro em `profiles` e `user_roles` (role `user`).
3. Inserir/atualizar registro em `subscribers` com:
   - `email`: bernardorodrigues.13j@gmail.com
   - `full_name`: Bernardo
   - `user_id`: id do novo usuário
   - `subscription_status`: `active`
   - `product_source`: `vip`
   - `subscription_expires_at`: 1 ano a partir de hoje

**Como vou executar:** rodarei um script Node usando a `SUPABASE_SERVICE_ROLE_KEY` para chamar `auth.admin.createUser` e fazer o upsert em `subscribers`. Sem alteração de código da aplicação, sem migration.

**Resultado esperado:** Bernardo poderá fazer login com email/senha e terá acesso VIP imediato.
