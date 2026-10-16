# Guia para verificar a "assinatura emprestada" no outro app

## O que vou entregar
Um guia em português, salvo nos documentos do projeto (`docs/guia-assinatura-revenuecat.md`), com três partes:

1. **O que você faz nos painéis (sem código)**
   - RevenueCat, em cada projeto (Apple e Google Play): Restore Behavior = "Keep with original App User ID".
   - Criar uma chave secreta (Secret API key) em cada projeto do RevenueCat e colar quando o Lovable pedir.
   - Como testar: celular com uma conta da loja que já assinou, entrar com uma conta nova do app e confirmar que só 3 aulas abrem (ou o limite grátis daquele app).
   - Conferir o número da versão no app para ter certeza de que o live update chegou.

2. **Prompt pronto para colar no Lovable do outro app.** Ele pede para o Lovable primeiro checar e mandar um relatório, sem mudar nada, sobre:
   - se o app restaura compras sozinho ao entrar;
   - se o celular decide sozinho quem é Premium (lendo o RevenueCat no aparelho) em vez de perguntar ao servidor;
   - se o app pega assinaturas "sem dono" e passa para quem entrou;
   - se o usuário consegue gravar a própria assinatura direto no banco (regras de acesso);
   - se a conferência no servidor existe e usa duas chaves secretas (Apple e Google Play);
   - se o aviso automático do RevenueCat (webhook) sobrescreve VIPs ou junta contas pelo número da compra;
   - se o limite grátis é contado no servidor e não pode ser apagado pelo usuário;
   - se existe um número de versão visível no app;
   - se há registros no banco ativos com a mesma compra em mais de uma conta.
   Depois disso, o Lovable propõe um plano de correção igual ao que fizemos aqui.

3. **Resumo do que corrigimos aqui**, como referência: só o servidor decide quem é Premium, sem restaurar compras automaticamente, sem passar assinaturas sem dono para outras contas, sem gravação direta no banco, VIP protegido e versão aparecendo no Perfil.

Também vou mostrar o prompt aqui no chat, para você copiar direto.

## Detalhes técnicos
- Arquivo novo: `docs/guia-assinatura-revenuecat.md`. Nada muda no código do app.
