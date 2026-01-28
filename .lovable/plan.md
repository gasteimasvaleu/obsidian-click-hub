

## Configuração de Acesso Admin e Cadastro de Usuários

### Status Atual

✅ **Você já é admin!** Encontrei seu registro na tabela `user_roles`:
- Email: caiorobbb@gmail.com
- User ID: b4e481e6-172e-4874-aba7-4fe54727e947
- Role: admin

### Mudanças a Implementar

#### 1. Adicionar Link Admin na Navbar Superior

**Arquivo:** `src/components/FuturisticNavbar.tsx`

Adicionar:
- Importar o hook `isAdmin` do AuthContext
- Importar ícone `Settings` do lucide-react
- Exibir link para `/admin` apenas quando o usuário for admin

```text
┌────────────────────────────────────────────────────────┐
│  BíbliaToonKIDS    [👤] [⚙️Admin] [🚪] [ℹ️]           │
│                         ↑                              │
│                    Novo ícone (só para admins)         │
└────────────────────────────────────────────────────────┘
```

#### 2. Modificar Página de Cadastro para Admins

**Arquivo:** `src/pages/Cadastro.tsx`

Adicionar modo de cadastro manual para admins:
- Verificar se o usuário está logado e é admin
- Se for admin sem token: exibir formulário completo para cadastrar novos usuários
- Se tiver token: manter fluxo atual de validação
- Se não for admin e sem token: exibir erro de link inválido

**Novo Fluxo:**
```text
Usuário acessa /cadastro
        │
        ├── Com token? → Fluxo normal (validar token + completar cadastro)
        │
        └── Sem token?
                │
                ├── É admin logado? → Formulário de cadastro manual
                │                     (email + nome + telefone + senha)
                │
                └── Não é admin → Exibir "Link Inválido"
```

### Detalhes Técnicos

**FuturisticNavbar.tsx:**
- Adicionar `isAdmin` ao destructuring do `useAuth()`
- Adicionar `Settings` aos imports do lucide-react
- Renderizar ícone de admin entre o perfil e logout quando `isAdmin === true`

**Cadastro.tsx:**
- Importar `useAuth` do AuthContext
- Criar novo estado `isAdminMode` para diferenciar os modos
- Verificar no `useEffect`: se não tem token + usuário logado + é admin → ativar modo admin
- Criar novo formulário de cadastro completo para admins com campo de email editável
- Criar função `handleAdminSubmit` que usa `supabase.auth.admin.createUser` ou edge function

### Segurança

- O acesso ao cadastro manual continua protegido pela verificação `isAdmin` do AuthContext
- A criação de usuário via admin usará uma edge function com validação de role
- Não há exposição de funcionalidades admin para usuários normais

