# Página Liturgia Diária (/liturgia)

## O que o usuário vai ver
- Novo item **Liturgia** no menu Mais, logo após Terço, com imagem 2D (missal aberto).
- Página no padrão do app: barra violeta de voltar, espaço para vídeo de topo (você pode enviar depois), título "Liturgia **Diária**".
- Faixa com a data, o nome do dia (ex.: "Cristo Rei, Solenidade") e a cor litúrgica (bolinha Verde/Branco/Vermelho/Roxo/Rosa).
- Abas em barra violeta: **1ª Leitura**, **Salmo**, **2ª Leitura** (só quando houver), **Evangelho**.
- Cada leitura em card igual aos da Bíblia: referência, título e texto; o Salmo com o refrão em destaque.
- Card **Reflexão para a Família**: explicação curta e simples do Evangelho, gerada por IA com a linha católica já usada no app.
- Setas para ver o dia anterior e o seguinte.
- Acesso livre para todos que fizeram login.

## De onde vêm os textos
API pública de liturgia diária brasileira (liturgia.up.railway.app), que já responde com os textos do dia de hoje (testei: 22/11/2026, Cristo Rei, cor Branco). Os textos ficam guardados no nosso banco, então cada dia é baixado uma vez só e abre rápido.

## Home
Nada muda na tela inicial.

## Detalhes técnicos
- Tabela `daily_liturgy` (date PK, color, title, readings jsonb, reflection text, created_at); RLS SELECT para authenticated; escrita só service_role; GRANTs conforme regras do schema.
- Edge Function `daily-liturgy` (verify em código): recebe `date` (validado com Zod, ±7 dias), retorna do cache ou busca a API, gera a reflexão com Lovable AI (google/gemini-2.5-flash) e salva.
- Normalização da resposta em `src/lib/liturgia/normalize.ts` com teste vitest (2ª leitura opcional, cor mapeada para token).
- `src/pages/Liturgia.tsx` com BubbleSection, SPLIT_BAR, ArrowNavButton; rota protegida em App.tsx; item no menu em tubelight-navbar.tsx; imagem `src/assets/more-menu/liturgia.png`.
- Regra nova no AGENTS.md. Depois, publicar build Web no Appflow (canal Production).
