

## Resolução das 4 Rejeições da Apple

### Resumo dos Problemas

| # | Guideline | Problema | Onde resolver |
|---|-----------|----------|---------------|
| 1 | 2.3.2 | Imagem promocional do IAP tem referência a preço | **App Store Connect** (não é código) |
| 2 | 2.3.2 | Imagem promocional é screenshot do app | **App Store Connect** (não é código) |
| 3 | 3.1.2(c) | Descrição da assinatura não explica o que o usuário recebe | **App Store Connect** (não é código) |
| 4 | 4 (Design) | Sign in with Apple pede nome/email/senha após login | **Código** + possivelmente **Supabase** |

---

### Itens 1, 2 e 3 — Correções no App Store Connect (sem código)

**Item 1 — Remover preço da imagem do IAP:**
- Vá em App Store Connect > seu app > Assinaturas > "Assinatura Mensal" > Imagem Promocional
- Remova qualquer referência a preço (ex: "R$ 29,90/mês") da imagem. O preço já aparece automaticamente na App Store.

**Item 2 — Substituir imagem promocional:**
- A imagem atual é um screenshot do app — isso não é permitido
- Crie uma imagem de arte/design (1024x1024px) que represente visualmente o conteúdo da assinatura (ex: ícones de Bíblia, jogos, músicas, devocionais com a marca BíbliaToon Club)
- Não pode ser screenshot, não pode ter preço

**Item 3 — Melhorar descrição da assinatura:**
- No App Store Connect > Assinaturas > "Assinatura Mensal":
  - **Display Name** (máx 30 chars): `Acesso Premium Completo`
  - **Description** (máx 45 chars): `Bíblia, jogos, músicas, devocionais e mais`

---

### Item 4 — Sign in with Apple (mudança no código)

A Apple diz que o app **oferece Sign in with Apple** mas depois pede nome, email e senha. Isso significa que o provedor Apple está habilitado no Supabase Auth. Precisamos:

1. **Adicionar botão "Sign in with Apple"** na tela de Login (`src/pages/Login.tsx`) usando `supabase.auth.signInWithOAuth({ provider: 'apple' })`

2. **Corrigir o fluxo pós-autenticação**: Quando o usuário faz login via Apple, o `handle_new_user` trigger no Supabase já cria o perfil automaticamente com o email/nome vindos do Apple ID. O app **não deve** redirecionar para Cadastro nem pedir nome/email/senha novamente.

3. **Garantir que o AuthContext** trate corretamente sessões vindas de OAuth (já faz isso via `onAuthStateChange`)

4. **Verificar se o Supabase tem o provedor Apple configurado** — se não tiver, será preciso habilitá-lo no painel do Supabase (Authentication > Providers > Apple). Para iOS nativo com Capacitor, é necessário configurar o Apple Sign-In no Xcode (capability) e no App Store Connect (Service ID).

### Alterações no código:

**`src/pages/Login.tsx`:**
- Adicionar botão "Continuar com Apple" com o ícone Apple (seguindo as guidelines do Human Interface)
- O botão chama `supabase.auth.signInWithOAuth({ provider: 'apple' })` 
- Deve usar estilo escuro/preto conforme Apple HIG para o botão
- Exibir apenas no iOS (`platform !== 'android'`)

**`src/contexts/AuthContext.tsx`:**
- Nenhuma mudança necessária — o `onAuthStateChange` já captura login OAuth

**`src/pages/Cadastro.tsx`:**
- Nenhuma mudança necessária — o fluxo Apple não passa por Cadastro

### Pré-requisito no Supabase:
- Verificar/habilitar o provedor Apple em Authentication > Providers no painel do Supabase

