

## Plano: Atualizar URL da logo na navbar

Substituir a URL antiga da logo na `FuturisticNavbar.tsx` pela nova URL sem espaços.

**Arquivo:** `src/components/FuturisticNavbar.tsx` (linha 19)

**Alteração:**
- De: `https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/Design%20sem%20nome.png`
- Para: `https://fnksvazibtekphseknob.supabase.co/storage/v1/object/public/criativos/logonova2navbar.png`

Depois disso, rodar `git pull` + `npx cap sync ios` + `node fix-signing.cjs` localmente para ver a mudança no simulador.

