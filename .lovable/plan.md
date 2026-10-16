# Permitir editar nome e foto do perfil (todos os logins)

## Problema

- **Foto**: o botão de câmera sobre o avatar só aparece em `hover` (mouse). No celular ele nunca aparece, então ninguém consegue trocar a foto pelo app.
- **Nome**: não existe edição de nome no app. O nome vem do provedor (Google/Apple); a Apple geralmente não envia nome, então o perfil fica "Usuário Apple" sem como corrigir.

## Correção proposta (`src/pages/Profile.tsx`)

1. **Foto**: substituir o botão de câmera "hover-only" por um selo de câmera sempre visível no canto inferior direito do avatar (pequeno círculo com ícone, borda do tema). Toque abre o mesmo modal `AvatarUpload` já existente — nenhuma mudança no upload em si.
2. **Nome**: adicionar um ícone de lápis ao lado do nome. Ao tocar, abre um diálogo com campo de texto para editar o nome:
   - Salva em `profiles.full_name` (UPDATE por `id = user.id`).
   - Atualiza também `user_metadata.full_name` via `supabase.auth.updateUser`, para refletir imediatamente na tela.
   - Validação: nome não vazio, máx. 60 caracteres.
3. O nome exibido passa a priorizar `profiles.full_name` (editável) e cai para `user_metadata.full_name` como antes.

## Validação

- Build OK.
- No preview logado: tocar no selo de câmera abre o modal de upload; editar o nome salva e aparece na hora; recarregar a página mantém o nome novo.
