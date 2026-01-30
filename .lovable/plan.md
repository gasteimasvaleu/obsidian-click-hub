

## Corrigir Erro de Logout "Auth Missing Session"

### Problema Identificado

A sessão armazenada no navegador foi invalidada no servidor (provavelmente expirou ou foi encerrada em outro dispositivo). Quando o Supabase tenta fazer logout, não encontra a sessão no servidor e retorna erro 403.

### Solucao

Modificar a funcao `signOut` para lidar com este cenario:
1. Tentar fazer logout normal
2. Se houver erro de sessao nao encontrada, limpar o estado local de qualquer forma
3. Garantir que o usuario seja deslogado da interface mesmo quando o servidor ja nao reconhece a sessao

### Alteracoes Necessarias

**Arquivo: `src/contexts/AuthContext.tsx`**

Atualizar a funcao `signOut` (linhas 142-149):

```typescript
const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    // Mesmo se houver erro (como session_not_found), limpar estado local
    setSession(null);
    setUser(null);
    setIsAdmin(false);
    
    if (error) {
      // Se for erro de sessao nao encontrada, apenas logar
      // O logout local ja foi feito
      console.log('Logout server-side falhou (sessao provavelmente ja expirada):', error.message);
    }
    
    toast.success('Logout realizado com sucesso');
  } catch (err) {
    // Fallback: limpar estado local mesmo em caso de excecao
    setSession(null);
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('sb-fnksvazibtekphseknob-auth-token');
    toast.success('Logout realizado com sucesso');
  }
};
```

### Por que Funciona

- O Supabase armazena a sessao no localStorage
- Quando a sessao do servidor expira, o cliente ainda tem os dados locais
- A solucao limpa o estado React E o localStorage, independente do que o servidor responde
- O usuario e redirecionado para login normalmente

### Teste

Apos a implementacao:
1. Ir para a pagina de perfil
2. Clicar em logout (botao na navbar)
3. Verificar se e redirecionado para /login sem erros

