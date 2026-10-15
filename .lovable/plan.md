# Corrigir login Google no navegador (erro localhost:3000)

## Diagnóstico
O código do app está correto: o login Google usa `redirectTo: window.location.origin` (src/pages/Login.tsx, linhas 102-105 e 163-166). O erro acontece porque no painel do Supabase o "Site URL" está configurado como `http://localhost:3000`. Como o endereço do site publicado (bibliatoonclub.com) não está na lista de endereços permitidos, o Supabase ignora o retorno correto e manda o usuário para localhost:3000 — que não existe no computador, daí o erro "Safari não pode conectar-se ao servidor".

## Correção (no painel do Supabase, sem mexer no código)
1. Abrir: https://supabase.com/dashboard/project/fnksvazibtekphseknob/auth/url-configuration
2. Em **Site URL**, trocar `http://localhost:3000` por `https://bibliatoonclub.com`
3. Em **Redirect URLs**, adicionar (uma por linha):
   - `https://bibliatoonclub.com/**`
   - `https://www.bibliatoonclub.com/**`
   - `https://app.bibliatoonkids.com/**`
   - `http://localhost:3000/**` (manter, para testes locais)
   - `capacitor://localhost/**` (app nativo)
4. Salvar e testar o login Google novamente no navegador.

## Validação
- Entrar em bibliatoonclub.com/login, clicar "Continuar com Google", escolher a conta e confirmar que volta logado para a tela inicial.
