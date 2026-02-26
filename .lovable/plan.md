

# Adicionar Botao "Excluir Conta" na Pagina Profile

## Resumo

Adicionar um botao "Excluir Conta" logo abaixo do botao "Sair da Conta" na pagina `/profile`. O botao abrira um dialogo de confirmacao (AlertDialog) antes de executar a exclusao, para evitar cliques acidentais.

## Comportamento

1. Botao vermelho "Excluir Conta" com icone de lixeira, abaixo do "Sair da Conta"
2. Ao clicar, abre um AlertDialog pedindo confirmacao com aviso de que a acao e irreversivel
3. Ao confirmar, chama `supabase.auth.admin.deleteUser()` -- porem, como o client anonimo nao tem permissao de admin, a exclusao sera feita via uma Edge Function dedicada (`delete-account`) que recebe o token do usuario e deleta a conta
4. Apos exclusao, limpa a sessao e redireciona para `/login`

## Detalhes tecnicos

### 1. Edge Function `delete-account`
- Recebe o JWT do usuario autenticado
- Usa o Supabase service_role key para deletar o usuario via `supabase.auth.admin.deleteUser(userId)`
- O cascade na tabela profiles cuidara de limpar dados relacionados

### 2. Alteracoes em `src/pages/Profile.tsx`
- Importar `Trash2` do lucide-react e `AlertDialog` components
- Adicionar estado `deleting` para controlar loading
- Adicionar funcao `handleDeleteAccount` que chama a Edge Function
- Adicionar botao "Excluir Conta" e AlertDialog de confirmacao abaixo do botao "Sair da Conta"

## Layout

```text
[Botao "Sair da Conta"]
[Botao "Excluir Conta"]   <-- novo, com AlertDialog de confirmacao
```

## Arquivos modificados/criados

| Arquivo | Alteracao |
|---------|-----------|
| `supabase/functions/delete-account/index.ts` | Nova Edge Function para deletar conta do usuario |
| `src/pages/Profile.tsx` | Adicionar botao "Excluir Conta" com AlertDialog e chamada a Edge Function |

