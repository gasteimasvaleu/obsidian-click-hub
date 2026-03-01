

## Corrigir fluxo de cadastro pos-compra RevenueCat

O botao de App Store no Login ja esta integrado com o RevenueCat e funciona corretamente no app nativo. Porem, apos a compra bem-sucedida, o usuario e redirecionado para `/cadastro?source=revenuecat`, que atualmente mostra "Link Invalido" porque a pagina so aceita tokens do Hotmart.

Precisamos adicionar um fluxo de cadastro direto para usuarios que vieram do RevenueCat.

### Arquivo: `src/pages/Cadastro.tsx`

**Mudancas:**

1. Detectar o parametro `source=revenuecat` no useEffect inicial
2. Quando `source=revenuecat`, mostrar um formulario de cadastro direto (sem token) com campos: email, nome, telefone, senha, confirmar senha
3. No submit, usar `signUp` do AuthContext (que ja cria o usuario no Supabase com perfil automatico via trigger `handle_new_user`)
4. Apos o cadastro, o `identifyUser` no AuthContext sincroniza automaticamente o ID com o RevenueCat
5. O webhook do RevenueCat vai atualizar a tabela `subscribers` quando receber o evento de compra

### Detalhes tecnicos

No `useEffect`, adicionar verificacao:
```
if (searchParams.get('source') === 'revenuecat') {
  setTokenStatus('revenuecat');
}
```

Adicionar novo case `'revenuecat'` no `renderContent()` com formulario completo (email, nome, telefone, senha). O submit usara `signUp` do AuthContext em vez da edge function `complete-signup`.

Adicionar `'revenuecat'` ao tipo `TokenStatus`.

### Resultado

O fluxo completo sera:
1. Usuario clica "App Store" no Login
2. RevenueCat abre a tela de compra nativa da Apple
3. Compra confirmada -> redireciona para `/cadastro?source=revenuecat`
4. Usuario preenche email, nome e senha
5. Conta criada no Supabase -> `identifyUser` sincroniza com RevenueCat
6. Webhook do RevenueCat atualiza `subscribers` com status ativo
